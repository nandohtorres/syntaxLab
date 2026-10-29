import React, { useEffect, useRef, useState } from 'react'
import { Alert, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, MenuItem, Stack, Tab, Tabs, TextField, Typography } from '@mui/material'
import Editor from '@monaco-editor/react'
import { definePracticeTheme, download, mono } from '../editorSupport.js'
import { dueLessons, pickNext } from '../progress.js'
import { drills, levels, topics } from './content.js'
import { corrections, references } from './sources.js'
import { blankRecall, exercises, KEY, rateRecall, restoreRecall } from './recall.js'

function load() {
  try { const raw = localStorage.getItem(KEY); return { data: raw ? restoreRecall(JSON.parse(raw)) : blankRecall(), error: '' } }
  catch { return { data: blankRecall(), error: 'Stored interview practice could not be read. Saving is paused; export the stored data before replacing it.' } }
}
function Sources({ ids }) {
  return <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>{ids.map(id => <Button key={id} component="a" href={references[id][1]} target="_blank" rel="noopener noreferrer" size="small" sx={{ fontSize: 11 }}>{references[id][0]}</Button>)}</Stack>
}

export default function InterviewPractice() {
  const [initial] = useState(load)
  const [data, setData] = useState(initial.data)
  const [error, setError] = useState(initial.error)
  const [saveEnabled, setSaveEnabled] = useState(!initial.error)
  const [tab, setTab] = useState('study')
  const [level, setLevel] = useState('all')
  const [query, setQuery] = useState('')
  const [reviewOnly, setReviewOnly] = useState(false)
  const [reveal, setReveal] = useState(false)
  const [checked, setChecked] = useState([])
  const [rated, setRated] = useState(false)
  const [helped, setHelped] = useState(!!initial.data.drafts[initial.data.selectedId]?.['answer.txt'])
  const helpThisVisit = useRef(false)
  const [notice, setNotice] = useState('')
  const [roundDialog, setRoundDialog] = useState(false)
  const [round, setRound] = useState({ rated: 0, recalled: 0 })
  const [imported, setImported] = useState(null)
  const importInput = useRef(null)
  const queue = useRef([])
  const turn = useRef(0)
  const action = useRef(null)
  const drill = drills.find(item => item.id === data.selectedId) ?? drills[0]
  const answer = data.drafts[drill.id]?.['answer.txt'] ?? ''
  const topic = topics.find(item => item.id === drill.topicId)
  const filtered = topics.filter(item => (level === 'all' || item.level === Number(level)) && `${item.title} ${item.notes.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  const pool = exercises.filter(item => (level === 'all' || item.level === Number(level)) && `${item.title} ${item.prompt}`.toLowerCase().includes(query.toLowerCase()))
  const due = dueLessons(exercises, data.progress)
  const duePool = pool.filter(item => due.some(other => other.id === item.id))

  useEffect(() => {
    if (!saveEnabled) return
    try { localStorage.setItem(KEY, JSON.stringify(data)) }
    catch { setSaveEnabled(false); setError('Browser storage is full or unavailable. Export this session to keep your work.') }
  }, [data, saveEnabled])
  useEffect(() => { action.current = () => { if (answer.trim()) setReveal(true) } }, [answer])

  function choose(next, reviewing = false) {
    if (!next) return
    setData(current => ({ ...current, selectedId: next.id }))
    setReveal(false); setChecked([]); setRated(false)
    helpThisVisit.current = false
    setHelped(!!data.drafts[next.id]?.['answer.txt'])
    setReviewOnly(reviewing); setTab('drills')
  }
  function start(reviewing = false) {
    const available = reviewing ? duePool : pool
    if (!available.length) { setNotice(reviewing ? 'No reviews are due for these filters. Practice the full topic pool or come back later.' : 'No drills match these filters.'); return }
    choose(available.find(item => !data.progress.records[item.id]?.successes) ?? available[0], reviewing)
  }
  function rate(remembered) {
    if (rated || !reveal || !answer.trim()) return
    if (remembered && checked.length !== drill.criteria.length) return
    setData(current => rateRecall(current, drill, { id: crypto.randomUUID(), answer, remembered, helped }))
    setRated(true)
    setRound(current => ({ rated: current.rated + 1, recalled: current.recalled + (remembered && !helped ? 1 : 0) }))
    if (!remembered && !queue.current.some(item => item.skillId === drill.topicId)) queue.current.push({ skillId: drill.topicId, fromId: drill.id, turn: turn.current + 3 })
  }
  function next() {
    turn.current += 1
    const nextDrill = pickNext(reviewOnly ? duePool : pool, drill.id, data.progress, queue.current, turn.current)
    if (nextDrill) {
      queue.current = queue.current.filter(item => item.skillId !== nextDrill.topicId || item.turn > turn.current)
      choose(nextDrill, reviewOnly)
    } else setNotice('This review queue is complete. Choose Start practice for more reps.')
    if (round.rated > 0 && round.rated % 10 === 0) setRoundDialog(true)
  }
  async function importBackup(event) {
    const file = event.target.files?.[0]; event.target.value = ''
    if (!file) return
    try {
      if (file.size > 32000000) throw new Error('Choose a backup below 32 MB.')
      setImported(restoreRecall(JSON.parse(await file.text())))
    } catch (problem) { setNotice(problem.message) }
  }
  const coverage = Object.keys(data.progress.records).length

  return <Box component="main" sx={{ maxWidth: 1120, mx: 'auto', p: { xs: 2, sm: 4 } }}>
    <Typography sx={{ color: 'primary.main', fontSize: 11, letterSpacing: 2 }}>INTERVIEW RECALL</Typography>
    <Typography component="h1" sx={{ fontSize: { xs: 29, sm: 38 }, fontWeight: 650, mt: 1 }}>Understand it. Explain it. Repeat it.</Typography>
    <Typography sx={{ my: 1.5, color: 'text.secondary', fontSize: 14 }}>A reusable study sheet from your two interview documents, corrected and ordered from basics to application. {topics.length} topics · {drills.length} typed-answer drills · {coverage} attempted.</Typography>
    <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 2 }}>Write in the editor, compare against the reference, then rate your recall. This is self-assessment, with no AI grading. Personal source stories stay in your original files.</Typography>
    {error && <Alert severity="warning">{error}<Stack direction="row"><Button onClick={() => download('interview-unread-data.txt', localStorage.getItem(KEY) ?? '')}>Export stored data</Button><Button onClick={() => { setSaveEnabled(true); setError('') }}>Save this session</Button></Stack></Alert>}
    <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto" aria-label="Interview workspace">
      <Tab value="study" label="Study sheet" /><Tab value="drills" label="Rapid drills" /><Tab value="corrections" label="Corrections & sources" />
    </Tabs>
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1.5, my: 2 }}>
      <TextField select label="Learning level" value={level} onChange={event => setLevel(event.target.value)} size="small" sx={{ minWidth: 240 }}><MenuItem value="all">All levels</MenuItem>{levels.map((name, index) => <MenuItem key={name} value={String(index + 1)}>{index + 1}. {name}</MenuItem>)}</TextField>
      <TextField label="Search interview topics" value={query} onChange={event => setQuery(event.target.value)} size="small" sx={{ flex: 1 }} />
      <Button variant="outlined" onClick={() => start(true)}>Due review ({duePool.length})</Button>
      <Button variant="contained" onClick={() => start()}>Start practice</Button>
    </Stack>
    {tab === 'study' && <Box>
      {filtered.map(item => <Box key={item.id} sx={{ p: 2.5, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography sx={{ color: 'primary.main', fontSize: 11 }}>{item.level}. {levels[item.level - 1]}</Typography>
        <Typography component="h2" sx={{ fontSize: 21, fontWeight: 600, mt: 0.5 }}>{item.title}</Typography>
        <Stack component="ul" spacing={1} sx={{ pl: 2.5 }}>{item.notes.map(note => <Typography component="li" key={note} sx={{ fontSize: 14, lineHeight: 1.9 }}>{note}</Typography>)}</Stack>
        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Source notes: {item.origin}</Typography><Sources ids={item.sources} />
        <Button size="small" onClick={() => choose(drills.find(value => value.topicId === item.id))}>Drill this topic</Button>
      </Box>)}
      {!filtered.length && <Alert severity="info">No study topics match these filters.</Alert>}
      <Box sx={{ p: 3, border: '1px solid #98e7c43d', borderRadius: 2 }}><Typography component="h2" sx={{ fontSize: 23 }}>Now close the notes and recall it.</Typography><Typography sx={{ color: 'text.secondary', my: 1 }}>Use short rounds of ten. Write a sentence, code fragment or query; compare the reasoning, mark gaps honestly and repeat missed concepts.</Typography><Button variant="contained" onClick={() => start()}>Start the drill quiz</Button></Box>
    </Box>}
    {tab === 'drills' && <Box>
      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}><Chip size="small" label={`${drill.level}. ${levels[drill.level - 1]}`} /><Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{drill.title} · {reviewOnly ? 'Due review' : 'Practice'} · Round rep {round.rated % 10 + 1}</Typography></Stack>
      <Box sx={{ p: 2.5, mb: 2, border: '1px solid #2a384c', bgcolor: '#141e2c', borderRadius: 2 }}><Typography component="h2" sx={{ fontSize: 20, lineHeight: 1.6 }}>{drill.prompt}</Typography></Box>
      {helped && <Alert severity="info" sx={{ mb: 1 }}>A saved answer or study help is loaded. Use Fresh attempt before revealing for an independent rep.</Alert>}
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: '#101722' }}>
        <Stack direction="row" sx={{ alignItems: 'center', px: 2, py: 1 }}><Typography sx={{ flex: 1, fontFamily: mono, fontSize: 12 }}>recall.txt</Typography><Button size="small" disabled={reveal} onClick={() => { setData(current => ({ ...current, drafts: { ...current.drafts, [drill.id]: { 'answer.txt': '' } } })); setHelped(helpThisVisit.current) }}>Fresh attempt</Button></Stack>
        <Editor height="245px" language="plaintext" path={`interview/${drill.id}.txt`} value={answer} theme="synlab-practice" beforeMount={definePracticeTheme} onChange={value => { setData(current => ({ ...current, drafts: { ...current.drafts, [drill.id]: { 'answer.txt': (value ?? '').slice(0, 15000) } } })) }} onMount={(instance, api) => { instance.addCommand(api.KeyMod.CtrlCmd | api.KeyCode.Enter, () => action.current?.()); instance.focus() }} options={{ ariaLabel: 'Interview answer editor', fontFamily: mono, fontSize: 16, lineHeight: 27, automaticLayout: true, occurrencesHighlight: 'off', minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 12 }, wordWrap: 'on', readOnly: reveal, quickSuggestions: false }} />
        <Stack direction="row" sx={{ p: 1.5, gap: 1, flexWrap: 'wrap' }}><Button size="small" onClick={() => { helpThisVisit.current = true; setHelped(true); setTab('study'); setQuery(topic.title) }}>Review this note</Button><Box sx={{ flex: 1 }} /><Button variant="contained" disabled={!answer.trim() || reveal} onClick={() => setReveal(true)}>Check my recall</Button></Stack>
      </Box>
      {reveal && <Box role="status" aria-live="polite" sx={{ p: 2.5, my: 2, border: '1px solid #98e7c43d', borderRadius: 2 }}>
        <Typography sx={{ color: 'primary.main', fontWeight: 650 }}>Reference answer</Typography><Typography sx={{ mt: 1, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.9 }}>{drill.answer}</Typography>
        <Typography sx={{ mt: 2, fontSize: 13, color: 'text.secondary' }}>Tick only what your original answer already included. Equivalent wording is fine.</Typography>
        <Stack>{drill.criteria.map((criterion, index) => <FormControlLabel key={criterion} control={<Checkbox checked={checked.includes(index)} disabled={rated} onChange={(_, value) => setChecked(current => value ? [...current, index] : current.filter(item => item !== index))} />} label={criterion} />)}</Stack>
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', mt: 1 }}><Button disabled={rated} variant="outlined" onClick={() => rate(false)}>Needs another rep</Button><Button disabled={rated || checked.length !== drill.criteria.length} variant="contained" onClick={() => rate(true)}>I recalled it</Button></Stack>
        {rated && <Typography sx={{ mt: 1, color: 'primary.main', fontSize: 12 }}>Self-rating saved. Misses return immediately in due review and after intervening practice; assisted recall returns after ten minutes.</Typography>}
        <Sources ids={drill.sources} />
      </Box>}
      <Stack direction="row" sx={{ mt: 2, justifyContent: 'space-between' }}><Button onClick={() => { setHelped(true); choose(pickNext(pool, drill.id, data.progress), reviewOnly) }}>Skip for now</Button><Button variant="contained" disabled={!rated} onClick={next}>Next drill →</Button></Stack>
      <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 2 }}>Independent self-rated recall returns in 1/3/7/14 days. This is a practice schedule, not an objective knowledge score. SQL and code fragments in this workspace are reviewed against a reference, not executed.</Typography>
    </Box>}
    {tab === 'corrections' && <Box>
      <Alert severity="info" sx={{ mb: 2 }}>Both original files are unchanged. Personal prose, hiring anecdotes and old completed-question marks are excluded from the reusable material. Technical extensions and coaching prompts are identified in the notes.</Alert>
      {corrections.map(([title, origin, explanation, ids]) => <Box key={title} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}><Typography component="h2" sx={{ fontSize: 18 }}>{title}</Typography><Typography sx={{ fontSize: 11, color: 'text.secondary', my: 0.5 }}>{origin}</Typography><Typography sx={{ fontSize: 14, lineHeight: 1.8 }}>{explanation}</Typography><Sources ids={ids} /></Box>)}
    </Box>}
    <Stack direction="row" sx={{ gap: 1, mt: 4, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button onClick={() => download('interview-recall-backup.json', JSON.stringify(data, null, 2), 'application/json')}>Export interview backup</Button><Button onClick={() => importInput.current.click()}>Import interview backup</Button>
      <Box component="input" ref={importInput} type="file" accept=".json,application/json" onChange={importBackup} sx={{ display: 'none' }} aria-label="Import interview backup" />
      <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Answers/progress stay in this browser. Export to switch devices. No account sync.</Typography>
    </Stack>
    <Dialog open={!!imported} onClose={() => setImported(null)}><DialogTitle>Replace interview practice data?</DialogTitle><DialogContent>This replaces this section’s stored answers and {Object.keys(imported?.progress.records ?? {}).length} incoming drill records. Export your current backup first.</DialogContent><DialogActions><Button onClick={() => setImported(null)}>Cancel</Button><Button onClick={() => { setData(imported); setImported(null); setReveal(false); setRated(false); setChecked([]); setHelped(true); queue.current = []; setReviewOnly(false); setSaveEnabled(true); setError('') }}>Replace interview data</Button></DialogActions></Dialog>
    <Dialog open={!!notice} onClose={() => setNotice('')}><DialogTitle>Practice update</DialogTitle><DialogContent>{notice}</DialogContent><DialogActions><Button onClick={() => setNotice('')}>Got it</Button></DialogActions></Dialog>
    <Dialog open={roundDialog} onClose={() => setRoundDialog(false)}><DialogTitle>Ten more recall reps.</DialogTitle><DialogContent>{round.rated} self-rated this session; {round.recalled} recalled without help. Keep answers short, use examples, and return to missed concepts.</DialogContent><DialogActions><Button onClick={() => setRoundDialog(false)}>Continue drills</Button></DialogActions></Dialog>
  </Box>
}
