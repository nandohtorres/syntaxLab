import React, { useEffect, useRef, useState } from 'react'
import { Alert, Box, Button, Chip, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, Stack, TextField, Typography } from '@mui/material'
import { lessons, byId, firstLesson } from './content/index.js'
import { tracks } from './content/catalog.js'
import { blankProgress, dueLessons, normalizeBackup, pickNext, recordAttempt, skillStatus, STORAGE_KEY, validFilePath } from './progress.js'
import ExerciseEditor, { download, mono } from './ExerciseEditor.jsx'
import FeedbackPanel from './FeedbackPanel.jsx'
import PathSidebar from './PathSidebar.jsx'
import usePracticeRunner from './usePracticeRunner.js'

function initialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { saved: normalizeBackup(JSON.parse(raw), lessons), error: '' } : { saved: null, error: '' }
  } catch {
    return { saved: null, error: 'Saved practice data could not be read. Automatic saving is paused. Export the stored data before starting fresh.' }
  }
}
const empty = { version: 1, kind: 'python-path', progress: blankProgress(), drafts: {}, notes: {}, selectedId: firstLesson.id }

export default function PracticePreview() {
  const [initial] = useState(initialState)
  const [data, setData] = useState(initial.saved ?? empty)
  const [storageError, setStorageError] = useState(initial.error)
  const [saving, setSaving] = useState(!initial.error)
  const exercise = byId.get(data.selectedId) ?? firstLesson
  const files = data.drafts[exercise.id] ?? exercise.initialFiles
  const [active, setActive] = useState(exercise.entry)
  const [hint, setHint] = useState(0)
  const [solution, setSolution] = useState(false)
  const assisted = useRef(!!initial.saved?.drafts[exercise.id] && !!initial.saved?.progress.records[exercise.id]?.successes)
  const helped = useRef(false)
  const credited = useRef(false)
  const [catalog, setCatalog] = useState(false)
  const [search, setSearch] = useState('')
  const [drawer, setDrawer] = useState(false)
  const [reviewMode, setReviewMode] = useState(false)
  const [notice, setNotice] = useState('')
  const [fileDialog, setFileDialog] = useState(false)
  const [fileName, setFileName] = useState('')
  const [fileError, setFileError] = useState('')
  const [resetDialog, setResetDialog] = useState(false)
  const [imported, setImported] = useState(null)
  const importInput = useRef(null)
  const [round, setRound] = useState({ completed: 0, independent: 0 })
  const [roundDialog, setRoundDialog] = useState(false)
  const turn = useRef(0)
  const retryQueue = useRef([])
  const { status, result, run, stop, restart, clearResult } = usePracticeRunner()
  const busy = status === 'running'
  const due = dueLessons(lessons, data.progress)
  const learned = lessons.filter(item => data.progress.records[item.id]?.successes)
  const variants = lessons.filter(item => item.skillId === exercise.skillId).length
  const passed = result?.passed === true

  useEffect(() => {
    if (!saving) return
    const timer = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }
      catch { setStorageError('Browser storage is full or unavailable. Export a backup to keep this session.'); setSaving(false) }
    }, 350)
    return () => clearTimeout(timer)
  }, [data, saving])

  function choose(next, reviewing = false) {
    if (!next || busy) return
    setData(current => ({ ...current, selectedId: next.id }))
    setActive(next.entry)
    setHint(0)
    setSolution(false)
    assisted.current = !!data.drafts[next.id] && !!data.progress.records[next.id]?.successes
    helped.current = false
    credited.current = false
    clearResult()
    setReviewMode(reviewing)
    setDrawer(false)
    setCatalog(false)
  }
  function change(value) {
    setData(current => ({ ...current, drafts: { ...current.drafts, [exercise.id]: { ...files, [active]: value } } }))
    clearResult()
  }
  async function submit() {
    const outcome = await run({ exercise, files })
    if (!outcome || credited.current) return
    const wasAssisted = assisted.current
    setData(current => ({ ...current, progress: recordAttempt(current.progress, exercise, { id: crypto.randomUUID(), passed: outcome.passed, assisted: wasAssisted }) }))
    if (outcome.passed) {
      credited.current = true
      setRound(current => ({ completed: current.completed + 1, independent: current.independent + (wasAssisted ? 0 : 1) }))
    } else {
      assisted.current = true
      helped.current = true
      if (!retryQueue.current.some(item => item.skillId === exercise.skillId)) retryQueue.current.push({ skillId: exercise.skillId, fromId: exercise.id, turn: turn.current + 3 })
    }
  }
  function next() {
    turn.current += 1
    const pool = reviewMode ? due : lessons.filter(item => item.track === exercise.track)
    const nextExercise = pickNext(pool, exercise.id, data.progress, retryQueue.current, turn.current)
    if (nextExercise) {
      retryQueue.current = retryQueue.current.filter(item => item.skillId !== nextExercise.skillId || item.turn > turn.current)
      choose(nextExercise, reviewMode)
    } else {
      setNotice('You have completed the due review queue. Come back later, or choose another track.')
      choose(lessons.find(item => !data.progress.records[item.id]?.successes) ?? firstLesson)
    }
    if (round.completed > 0 && round.completed % 10 === 0) setRoundDialog(true)
  }
  function startReview() {
    if (due.length) choose(due[0], true)
    else setNotice('No reviews are due yet. Independent passes return after 1, 3, 7 and 14 days; assisted passes return after 10 minutes. You can revisit any exercise in Browse.')
  }
  function addFile() {
    if (!validFilePath(fileName)) { setFileError('Use a relative name such as helpers.py or data/input.json. No spaces or .. segments.'); return }
    if (Object.hasOwn(files, fileName)) { setFileError('That file already exists.'); return }
    if (Object.keys(files).length >= 20) { setFileError('This workspace supports up to 20 files.'); return }
    setData(current => ({ ...current, drafts: { ...current.drafts, [exercise.id]: { ...files, [fileName]: '' } } }))
    setActive(fileName); setFileDialog(false); clearResult()
  }
  async function importBackup(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      if (file.size > 32000000) throw new Error('Choose a backup smaller than 32 MB.')
      setImported(normalizeBackup(JSON.parse(await file.text()), lessons))
    } catch (error) { setNotice(error.message) }
  }
  const sidebar = <PathSidebar lessons={lessons} progress={data.progress} exercise={exercise} choose={choose} review={startReview} due={due.length} browse={() => setCatalog(true)} busy={busy} />
  const trackTitle = tracks.find(track => track.id === exercise.track)?.title
  const retained = new Set(lessons.filter(item => skillStatus(data.progress, item, lessons.filter(other => other.skillId === item.skillId).length) === 'Retained').map(item => item.skillId)).size

  return <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
    <Stack component="header" direction="row" sx={{ minHeight: 78, px: { xs: 2, md: 5 }, py: 1, borderBottom: '1px solid', borderColor: 'divider', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
      <Typography sx={{ fontSize: 21, fontWeight: 750 }}>SyntaxLab <Box component="span" sx={{ color: 'primary.main', fontWeight: 400 }}> / Python Path</Box></Typography>
      <Box sx={{ flex: 1 }} />
      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{learned.length}/208 practiced · {retained} skills retained</Typography>
      <Button size="small" disabled={busy} onClick={() => setDrawer(true)} sx={{ display: { lg: 'none' } }}>Learning path</Button>
    </Stack>
    {storageError && <Alert severity="warning" action={<Stack direction="row"><Button size="small" onClick={() => download('python-path-unread-data.txt', localStorage.getItem(STORAGE_KEY) ?? '')}>Export stored data</Button><Button size="small" onClick={() => { setSaving(true); setStorageError('') }}>Save this session</Button></Stack>}>{storageError}</Alert>}
    <Box sx={{ display: 'flex', maxWidth: 1560, mx: 'auto' }}>
      <Box component="aside" aria-label="Learning path" sx={{ display: { xs: 'none', lg: 'block' }, borderRight: '1px solid', borderColor: 'divider' }}>{sidebar}</Box>
      <Drawer open={drawer} onClose={() => setDrawer(false)}>{sidebar}</Drawer>
      <Box component="main" sx={{ flex: 1, minWidth: 0, p: { xs: 2, sm: 4, md: 5 } }}>
        <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Typography sx={{ fontSize: 11, letterSpacing: 1.5, color: 'text.secondary' }}>{reviewMode ? 'DUE REVIEW' : trackTitle.toUpperCase()} / {exercise.unit}</Typography>
          <Chip size="small" variant="outlined" label={skillStatus(data.progress, exercise, variants)} />
          <Button size="small" disabled={busy} onClick={() => setCatalog(true)} sx={{ ml: 'auto' }}>Browse exercises</Button>
        </Stack>
        <Typography component="h1" sx={{ fontSize: { xs: 28, sm: 36 }, fontWeight: 650, letterSpacing: '-1px', mb: 2 }}>{exercise.title}</Typography>
        <Box sx={{ p: 2.5, mb: 2.5, bgcolor: '#141e2c', border: '1px solid #2a384c', borderRadius: 2 }}>
          <Typography sx={{ color: 'primary.main', fontSize: 10, fontWeight: 700, letterSpacing: 2, mb: 1 }}>YOUR TASK</Typography>
          <Typography sx={{ fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{exercise.prompt}</Typography>
          {exercise.argv && <Typography sx={{ mt: 1, fontFamily: mono, fontSize: 12 }}>Runner arguments: python {exercise.entry} {exercise.argv.join(' ')}</Typography>}
          {exercise.structures && <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 12 }}>Provided: ListNode(val, next), TreeNode(val, left, right), graph Node(val, neighbors), List, Optional, Counter, defaultdict, deque, heapq, math and lru_cache. Imports are also welcome.</Typography>}
          {exercise.url && <Button component="a" href={exercise.url} target="_blank" rel="noopener noreferrer" size="small">Original problem</Button>}
        </Box>
        {data.drafts[exercise.id] && data.progress.records[exercise.id]?.successes > 0 && <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 1 }}>Saved code is loaded. Reset the workspace for a fresh independent rep; rerunning a saved answer counts as assisted practice.</Typography>}
        <ExerciseEditor exercise={exercise} files={files} active={Object.hasOwn(files, active) ? active : exercise.entry} setActive={setActive} change={change} addFile={() => { setFileName(''); setFileError(''); setFileDialog(true) }} reset={() => setResetDialog(true)} status={status} run={submit} stop={stop} hint={() => { setHint(value => Math.min(value + 1, exercise.hints.length + 1)); assisted.current = true; helped.current = true }} passed={passed} />
        <Collapse in={hint > 0}>
          <Box sx={{ p: 2, mt: 1.5, bgcolor: '#98e7c408', borderRadius: 2 }}>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.8 }}>{exercise.note}</Typography>
            {exercise.hints.slice(0, hint).map((text, index) => <Typography key={index} sx={{ fontSize: 13, mt: 1 }}>Hint {index + 1}: {text}</Typography>)}
            <Button size="small" onClick={() => { setSolution(value => !value); assisted.current = true }}>{solution ? 'Hide worked solution' : 'Show worked solution'}</Button>
            {solution && Object.entries(exercise.solutionFiles).map(([name, text]) => <Box key={name}><Typography sx={{ fontSize: 12, mt: 1 }}>{name}</Typography><Typography component="pre" sx={{ fontFamily: mono, fontSize: 13, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{text}</Typography></Box>)}
            <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 1 }}>Hints, a revealed solution or a failed attempt make this visit assisted. A fresh rep is your next independent check.</Typography>
          </Box>
        </Collapse>
        <FeedbackPanel result={result} />
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{status === 'ready' ? 'Python ready' : status === 'unavailable' ? 'Python could not load' : status === 'running' ? 'Running your code' : 'Preparing Python runtime…'}</Typography>
          {status === 'unavailable' && <Button onClick={restart}>Retry loading</Button>}
          <Button disabled={!passed || busy} variant={passed ? 'contained' : 'text'} onClick={next}>Next rep →</Button>
        </Stack>
        <TextField label="Explain it in your own words (optional)" multiline minRows={2} fullWidth value={data.notes[exercise.id] ?? ''} onChange={event => setData(current => ({ ...current, notes: { ...current.notes, [exercise.id]: event.target.value.slice(0, 3000) } }))} helperText="Your own review note; not automatically graded. What does the code do, and why?" sx={{ mt: 3 }} />
        <Stack direction="row" sx={{ mt: 3, gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button size="small" onClick={() => download('python-path-backup.json', JSON.stringify(data, null, 2), 'application/json')}>Export backup</Button>
          <Button size="small" disabled={busy} onClick={() => importInput.current.click()}>Import backup</Button>
          <Box component="input" ref={importInput} type="file" accept="application/json,.json" onChange={importBackup} sx={{ display: 'none' }} aria-label="Import Python Path backup" />
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Saved on this browser only. Export before switching devices. Python initially downloads from jsDelivr.</Typography>
        </Stack>
      </Box>
    </Box>
    <Dialog open={catalog} onClose={() => setCatalog(false)} fullWidth maxWidth="sm">
      <DialogTitle>Choose your next rep</DialogTitle>
      <DialogContent>
        <TextField autoFocus fullWidth label="Search title, unit or track" value={search} onChange={event => setSearch(event.target.value)} sx={{ mt: 1, mb: 2 }} />
        <Stack spacing={0.5}>{lessons.filter(item => `${item.title} ${item.unit} ${item.track}`.toLowerCase().includes(search.toLowerCase())).map(item => <Button key={item.id} disabled={busy} onClick={() => choose(item)} sx={{ justifyContent: 'space-between', textAlign: 'left', gap: 2 }}>
          <Box><Typography sx={{ fontSize: 13 }}>{item.title}</Typography><Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{item.track} / {item.unit}{item.variant ? ` / variation ${item.variant + 1}` : ''}</Typography></Box>
          <Typography sx={{ fontSize: 11, whiteSpace: 'nowrap' }}>{data.progress.records[item.id]?.successes ? 'Practiced' : 'New'}</Typography>
        </Button>)}</Stack>
      </DialogContent>
      <DialogActions><Button onClick={() => setCatalog(false)}>Close</Button></DialogActions>
    </Dialog>
    <Dialog open={fileDialog} onClose={() => setFileDialog(false)} fullWidth maxWidth="xs"><DialogTitle>Create a workspace file</DialogTitle><DialogContent><TextField autoFocus fullWidth label="File name" value={fileName} onChange={event => setFileName(event.target.value)} error={!!fileError} helperText={fileError || 'For example: helpers.py'} sx={{ mt: 1 }} /></DialogContent><DialogActions><Button onClick={() => setFileDialog(false)}>Cancel</Button><Button onClick={addFile}>Create file</Button></DialogActions></Dialog>
    <Dialog open={resetDialog} onClose={() => setResetDialog(false)}><DialogTitle>Reset this exercise’s workspace?</DialogTitle><DialogContent>Your saved code for this exercise will be replaced by its starter files. Export a backup first if you want to keep it. Progress is kept. Hints or mistakes during this visit still count as assistance.</DialogContent><DialogActions><Button onClick={() => setResetDialog(false)}>Cancel</Button><Button onClick={() => { setData(current => ({ ...current, drafts: { ...current.drafts, [exercise.id]: exercise.initialFiles } })); assisted.current = helped.current; setActive(exercise.entry); clearResult(); setResetDialog(false) }}>Reset workspace</Button></DialogActions></Dialog>
    <Dialog open={!!imported} onClose={() => setImported(null)}><DialogTitle>Replace Python Path data?</DialogTitle><DialogContent>This backup contains {Object.keys(imported?.drafts ?? {}).length} workspaces and {Object.keys(imported?.progress.records ?? {}).length} exercise records. Import replaces this section’s saved work. Export your current backup first.</DialogContent><DialogActions><Button onClick={() => setImported(null)}>Cancel</Button><Button onClick={() => { const nextExercise = byId.get(imported.selectedId); setData(imported); setActive(nextExercise.entry); setHint(0); setSolution(false); helped.current = false; assisted.current = !!imported.drafts[nextExercise.id] && !!imported.progress.records[nextExercise.id]?.successes; credited.current = false; clearResult(); setReviewMode(false); retryQueue.current = []; setRound({ completed: 0, independent: 0 }); setImported(null); setSaving(true); setStorageError('') }}>Replace with backup</Button></DialogActions></Dialog>
    <Dialog open={roundDialog} onClose={() => setRoundDialog(false)}><DialogTitle>Ten more reps done.</DialogTitle><DialogContent>{round.completed} completed this session; {round.independent} passed without help on that visit. Retained status requires evidence across different days, plus different variations where available. Take a break or keep going.</DialogContent><DialogActions><Button onClick={() => setRoundDialog(false)}>Continue practice</Button></DialogActions></Dialog>
    <Dialog open={!!notice} onClose={() => setNotice('')}><DialogTitle>Practice update</DialogTitle><DialogContent>{notice}</DialogContent><DialogActions><Button onClick={() => setNotice('')}>Got it</Button></DialogActions></Dialog>
  </Box>
}
