import React, { useEffect, useRef, useState } from 'react'
import { Alert, Box, Button, Chip, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, Stack, TextField, Typography } from '@mui/material'
import { lessons as allLessons } from './content/index.js'
import { tracks } from './content/catalog.js'
import { pickNext, recordAttempt, skillStatus, validFilePath } from './progress.js'
import ExerciseEditor from './ExerciseEditor.jsx'
import { mono } from './editorSupport.js'
import FeedbackPanel from './FeedbackPanel.jsx'
import PathSidebar from './PathSidebar.jsx'
import usePracticeRunner from './usePracticeRunner.js'
import usePracticeData from './usePracticeData.js'
import { lessonsForScope, selectedForScope } from './practiceStore.js'
import { patternGuide } from './content/patternGuide.js'
import { useStudyLayout } from './layoutContext.js'
import StudyWorkspace from './StudyWorkspace.jsx'
import StudyLibrary from './StudyLibrary.jsx'
import { blind75Questions, slidingWindowSteps, leetCodePracticeLessons, stepsForQuestion } from './content/blind75Practice.js'
import { exerciseFileTools } from './exerciseFeatures.js'
import ExerciseExplanation from './ExerciseExplanation.jsx'
import SlidingWindowGuide from './SlidingWindowGuide.jsx'
import QuestionBreakdown from './QuestionBreakdown.jsx'
import BasicsBreakdown from './BasicsBreakdown.jsx'
import PatternVisual from './learning/PatternVisual.jsx'
import { partLayoutFromSearch } from './partLayouts.js'
import LessonSection from './LessonSection.jsx'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined'

const randomPracticeItem = items => items[Math.floor(Math.random() * items.length)]

export default function PracticePreview({ scope = 'all' }) {
  const layout = useStudyLayout()
  const { data, setData, storageError, resumeSaving, replacement, getReplacement, flush } = usePracticeData()
  const lastReplacement = useRef(replacement)
  const promptRef = useRef(null)
  const leetcode = scope === 'sliding-window' || scope === 'algorithms'
  const lessons = leetcode ? leetCodePracticeLessons : lessonsForScope(allLessons, scope)
  const firstLesson = lessons[0]
  const selectionPool = scope === 'sliding-window' ? [slidingWindowSteps[0], ...lessons.filter(item => item.id !== slidingWindowSteps[0].id)] : lessons
  const exercise = selectedForScope(data, selectionPool, scope)
  const sample = !!exercise.sample
  const questionParts = leetcode ? stepsForQuestion(exercise.problemId) : []
  const compact = scope === 'basics'
  const sectionTitle = leetcode ? 'LeetCode Python' : compact ? 'Python Basics' : 'Python Path'
  const files = data.drafts[exercise.id] ?? exercise.initialFiles
  const [active, setActive] = useState(exercise.entry)
  const partsLayout = partLayoutFromSearch(location.search)
  const [solution, setSolution] = useState(false)
  const assisted = useRef(!!data.drafts[exercise.id] && !!data.progress.records[exercise.id]?.successes)
  const helped = useRef(false)
  const credited = useRef(false)
  const [catalog, setCatalog] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [order, setOrder] = useState('ordered')
  const [fileDialog, setFileDialog] = useState(false)
  const [fileName, setFileName] = useState('')
  const [fileError, setFileError] = useState('')
  const [resetDialog, setResetDialog] = useState(false)
  const [round, setRound] = useState({ completed: 0, independent: 0 })
  const [roundDialog, setRoundDialog] = useState(false)
  const turn = useRef(0)
  const retryQueue = useRef([])
  const { status, result, run, stop, restart, clearResult } = usePracticeRunner()
  const busy = status === 'running'
  const learned = lessons.filter(item => data.progress.records[item.id]?.successes)
  const variants = lessons.filter(item => item.skillId === exercise.skillId).length
  const passed = result?.passed === true
  const taskPrompt = leetcode && exercise.id === exercise.libraryId && exercise.prompt === exercise.originalProblem?.statement
    ? 'Implement the full problem in the editor. Keep the provided class and method names.'
    : exercise.prompt

  useEffect(() => { clearResult(); if (!leetcode && !compact && promptRef.current) promptRef.current.parentElement.scrollTop = 0 }, [exercise.id, leetcode, compact, clearResult])
  useEffect(() => {
    if (lastReplacement.current === replacement) return
    lastReplacement.current = replacement
    stop()
    clearResult()
    setSolution(false)
    credited.current = false; helped.current = false
    assisted.current = !!data.drafts[exercise.id] && !!data.progress.records[exercise.id]?.successes
    retryQueue.current = []
    setRound({ completed: 0, independent: 0 })
  }, [replacement, data, exercise.id, stop, clearResult])

  function choose(next) {
    if (!next || busy) return
    setData(current => ({ ...current, selectedId: next.id, selections: { ...current.selections, [scope]: next.id } }))
    setActive(next.entry)
    setSolution(false)
    assisted.current = !!data.drafts[next.id] && !!data.progress.records[next.id]?.successes
    helped.current = false
    credited.current = false
    clearResult()
    setDrawer(false)
    setCatalog(false)
  }
  function change(value) {
    setData(current => ({ ...current, drafts: { ...current.drafts, [exercise.id]: { ...files, [active]: value } } }))
    clearResult()
  }
  async function submit() {
    const startedAtReplacement = replacement
    const outcome = await run({ exercise, files })
    if (!outcome || credited.current || getReplacement() !== startedAtReplacement) return
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
    if (leetcode) {
      const index = questionParts.findIndex(item => item.id === exercise.id)
      const nextQuestion = blind75Questions[(blind75Questions.findIndex(item => item.problemId === exercise.problemId) + 1) % blind75Questions.length]
      choose(questionParts[index + 1] ?? stepsForQuestion(nextQuestion.problemId)[0])
      return
    }
    turn.current += 1
    const pool = lessons.filter(item => item.track === exercise.track)
    const retryDue = retryQueue.current.some(item => item.turn <= turn.current && pool.some(value => value.skillId === item.skillId))
    const alternatives = pool.filter(item => item.id !== exercise.id && (order !== 'mixed' || item.unit === exercise.unit))
    const fresh = alternatives.filter(item => !data.progress.records[item.id]?.successes)
    const mixedPool = fresh.length ? fresh : alternatives
    const nextExercise = order === 'mixed' && !retryDue && mixedPool.length
      ? randomPracticeItem(mixedPool)
      : pickNext(pool, exercise.id, data.progress, retryQueue.current, turn.current)
    if (nextExercise) {
      retryQueue.current = retryQueue.current.filter(item => item.skillId !== nextExercise.skillId || item.turn > turn.current)
      choose(leetcode && nextExercise.id === 'b75-3' ? slidingWindowSteps[0] : nextExercise)
    } else {
      choose(lessons.find(item => !data.progress.records[item.id]?.successes) ?? firstLesson)
    }
    if (round.completed > 0 && round.completed % 10 === 0) setRoundDialog(true)
  }
  function skip() {
    if (leetcode) {
      const index = blind75Questions.findIndex(item => item.problemId === exercise.problemId)
      choose(stepsForQuestion(blind75Questions[(index + 1) % blind75Questions.length].problemId)[0])
      return
    }
    next()
  }
  function addFile() {
    if (!exerciseFileTools(exercise).add) return
    if (!validFilePath(fileName)) { setFileError('Use a relative name such as helpers.py or data/input.json. No spaces or .. segments.'); return }
    if (Object.hasOwn(files, fileName)) { setFileError('That file already exists.'); return }
    if (Object.keys(files).length >= 20) { setFileError('This workspace supports up to 20 files.'); return }
    setData(current => ({ ...current, drafts: { ...current.drafts, [exercise.id]: { ...files, [fileName]: '' } } }))
    setActive(fileName); setFileDialog(false); clearResult()
  }
  const catalogLessons = leetcode ? blind75Questions : lessons
  function openCatalogExercise(item) {
    if (leetcode) { choose(stepsForQuestion(item.problemId)[0]); return }
    if (lessons.some(value => value.id === item.id)) { choose(item); return }
    setData(current => ({ ...current, selectedId: item.id, selections: { ...current.selections, algorithms: item.id } }))
    flush()
    location.assign('?layout=island&mode=patterns#practice')
  }
  const sidebar = <PathSidebar lessons={lessons} progress={data.progress} exercise={exercise} choose={choose} browse={() => setCatalog(true)} busy={busy} scope={scope} />
  const guide = leetcode && patternGuide[exercise.unit]
  const trackTitle = tracks.find(track => track.id === exercise.track)?.title
  const retained = new Set(lessons.filter(item => skillStatus(data.progress, item, lessons.filter(other => other.skillId === item.skillId).length) === 'Retained').map(item => item.skillId)).size

  const workspaceEditor = <ExerciseEditor exercise={exercise} files={files} active={Object.hasOwn(files, active) ? active : exercise.entry} setActive={setActive} change={change} addFile={() => { setFileName(''); setFileError(''); setFileDialog(true) }} reset={() => setResetDialog(true)} status={status} run={submit} stop={stop} passed={passed} compact={compact} next={next} skip={skip} skipLabel={leetcode ? 'Skip question' : 'Skip exercise'} nextLabel={leetcode ? questionParts.at(-1).id === exercise.id ? 'Next question' : 'Next part' : 'Next exercise'} />
  const solutionPanel = <LessonSection title="Code solution" icon={CodeOutlinedIcon}>
    <Button size="small" variant="outlined" aria-expanded={solution} onClick={() => { setSolution(value => !value); assisted.current = true; helped.current = true }}>{solution ? 'Hide solution' : 'Show solution'}</Button>
    <Collapse in={solution}>
      {Object.entries(exercise.solutionFiles).map(([name, text]) => <Box key={name} sx={{ mt: 1.5 }}><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{name}</Typography><Typography component="pre" sx={{ fontFamily: mono, fontSize: 12, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', mt: 0.5 }}>{text}</Typography></Box>)}
    </Collapse>
  </LessonSection>
  const guidePanel = leetcode && exercise.unit === 'P06' ? <SlidingWindowGuide key={`guide-${exercise.id}`} exercise={exercise} /> : guide ? <LessonSection title="Pattern visual" tone="info">
    <PatternVisual problemId={exercise.problemId} unit={exercise.unit} binaryTree={exercise.unit === 'P09' && ![98, 230, 235].includes(exercise.problemId)} focus={[39,79].includes(exercise.problemId) ? 'backtrack' : [208,211].includes(exercise.problemId) ? 'trie' : undefined} />
    <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 1 }}>A small illustration of the pattern. The problem context and explanation describe this question's specific rules.</Typography>
  </LessonSection> : null

  const questionBody = partSelector => <>
    <LessonSection title="Your task" icon={AssignmentOutlinedIcon}>
      {partSelector && <Box sx={{ mb: 1.5, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>{partSelector}</Box>}
      <Typography sx={{ fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{taskPrompt}</Typography>
      {exercise.argv && <Typography sx={{ mt: 1, fontFamily: mono, fontSize: 12 }}>python {exercise.entry} {exercise.argv.join(' ')}</Typography>}
      {data.drafts[exercise.id] && data.progress.records[exercise.id]?.successes > 0 && <Typography sx={{ mt: 1, fontSize: 11, color: 'text.secondary' }}>Saved code loaded. Reset for a fresh attempt.</Typography>}
    </LessonSection>
    {guidePanel}
    {(leetcode || compact) && <ExerciseExplanation exercise={exercise} />}
    {solutionPanel}
  </>
  const dialogs = <><Dialog open={catalog} onClose={() => setCatalog(false)} fullWidth maxWidth="sm">
      <DialogTitle>Full questions list</DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: 13, mt: 1 }}>{sample ? "Blind 75 questions. Supporting steps are inside each question." : "Choose any exercise in this section."}</Typography>
        <Stack spacing={0.5}>{catalogLessons.map(item => <Button key={item.id} disabled={busy} onClick={() => openCatalogExercise(item)} sx={{ justifyContent: 'space-between', textAlign: 'left', gap: 2 }}>
          <Box><Typography sx={{ fontSize: 13 }}>{item.sample ? `${item.questionNumber}${item.title}` : item.title}</Typography><Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{item.track} / {item.unit}{item.variant ? ` / variation ${item.variant + 1}` : ''}</Typography></Box>
          <Typography sx={{ fontSize: 11, whiteSpace: 'nowrap' }}>{data.progress.records[item.id]?.successes ? 'Practiced' : 'New'}</Typography>
        </Button>)}</Stack>
      </DialogContent>
      <DialogActions><Button onClick={() => setCatalog(false)}>Close</Button></DialogActions>
    </Dialog>
    <Dialog open={fileDialog} onClose={() => setFileDialog(false)} fullWidth maxWidth="xs"><DialogTitle>Create a workspace file</DialogTitle><DialogContent><TextField autoFocus fullWidth label="File name" value={fileName} onChange={event => setFileName(event.target.value)} error={!!fileError} helperText={fileError || 'For example: helpers.py'} sx={{ mt: 1 }} /></DialogContent><DialogActions><Button onClick={() => setFileDialog(false)}>Cancel</Button><Button onClick={addFile}>Create file</Button></DialogActions></Dialog>
    <Dialog open={resetDialog} onClose={() => setResetDialog(false)}><DialogTitle>Reset this exercise’s workspace?</DialogTitle><DialogContent>Your saved code for this exercise will be replaced by its starter files. Progress is kept. A revealed solution or a failed attempt during this visit still counts as assistance.</DialogContent><DialogActions><Button onClick={() => setResetDialog(false)}>Cancel</Button><Button onClick={() => { setData(current => ({ ...current, drafts: { ...current.drafts, [exercise.id]: exercise.initialFiles } })); assisted.current = helped.current; setActive(exercise.entry); clearResult(); setResetDialog(false) }}>Reset workspace</Button></DialogActions></Dialog>
    <Dialog open={roundDialog} onClose={() => setRoundDialog(false)}><DialogTitle>Ten more reps done.</DialogTitle><DialogContent>{round.completed} completed this session; {round.independent} passed without help on that visit. Retained status requires evidence across different days, plus different variations where available. Take a break or keep going.</DialogContent><DialogActions><Button onClick={() => setRoundDialog(false)}>Continue practice</Button></DialogActions></Dialog>
    </>
  if (layout !== 'current') {
    const libraryItems = catalogLessons.map(item => {
      const track = tracks.find(value => value.id === item.track)
      const unit = track.units.find(value => value.id === item.unit)
      return { id: item.id, title: leetcode ? `${item.problemId}. ${item.title}` : item.title + (item.variant ? ` (${item.variant + 1})` : ''), optional: compact && item.track === 'scripts', group: compact && item.track === 'scripts' ? `Optional project: ${unit.title}` : leetcode && item.unit === 'P06' ? 'Sliding Window' : unit?.title ?? unit?.name ?? track.title, done: !!data.progress.records[item.id]?.successes }
    })
    const selectedListId = exercise.libraryId ?? exercise.id
    return <>
      {storageError && <Alert severity="warning" action={<Button onClick={resumeSaving}>Save this session</Button>}>{storageError}</Alert>}
      <StudyWorkspace
        libraryFraction={45}
        library={<StudyLibrary learningOrder={leetcode} key={exercise.unit} items={libraryItems} selectedId={selectedListId} choose={id => openCatalogExercise(catalogLessons.find(item => item.id === id))} disabled={busy} />}
        prompt={<Box ref={promptRef} sx={{ p: layout === 'island' ? 2 : 0 }}>
          {leetcode ? <QuestionBreakdown exercise={exercise} lessons={questionParts} choose={choose} disabled={busy} layout={partsLayout} pattern={exercise.unit === 'P06' ? 'Sliding Window' : tracks.find(track => track.id === exercise.track)?.units.find(unit => unit.id === exercise.unit)?.title ?? 'Python patterns'}>{questionBody}</QuestionBreakdown> : compact ? <BasicsBreakdown exercise={exercise} lessons={lessons} topic={tracks.find(track => track.id === exercise.track)?.units.find(unit => unit.id === exercise.unit)?.title ?? 'Python practice'} choose={choose} disabled={busy} controls={<Button size="small" disabled={busy} aria-label="Change practice order" onClick={() => setOrder(value => value === 'ordered' ? 'mixed' : 'ordered')}>{order === 'ordered' ? 'In order' : 'Mixed: current unit'}</Button>}>{questionBody}</BasicsBreakdown> : <>
            <Typography component="h1" sx={{ fontSize: 24, fontWeight: 650 }}>{exercise.title}</Typography>
            {compact && <Button size="small" disabled={busy} onClick={() => setOrder(value => value === 'ordered' ? 'mixed' : 'ordered')}>{order === 'ordered' ? 'In order' : 'Mixed: current unit'}</Button>}
            {questionBody()}
          </>}
        </Box>}
        editor={workspaceEditor}
        feedback={result ? <FeedbackPanel result={result} /> : null}
        footer={status !== 'ready' ? <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1 }}><Typography role="status" sx={{ fontSize: 11, color: 'text.secondary' }}>{status === 'unavailable' ? 'Python could not load' : status === 'running' ? 'Running your code' : 'Preparing Python runtime...'}</Typography>{status === 'unavailable' && <Button onClick={restart}>Retry loading</Button>}</Stack> : null}
      />
      {dialogs}
    </>
  }

  return <Box sx={{ minHeight: scope === 'all' ? '100dvh' : undefined, bgcolor: 'background.default' }}>
    <Stack component="header" direction="row" sx={{ minHeight: 78, px: { xs: 2, md: 5 }, py: 1, borderBottom: '1px solid', borderColor: 'divider', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
      <Typography sx={{ fontSize: 21, fontWeight: 750 }}>{sectionTitle}</Typography>
      <Box sx={{ flex: 1 }} />
      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{learned.length}/{lessons.length} practiced · {round.completed} this session · {round.independent} without help · {retained} skills retained</Typography>
      <Button size="small" disabled={busy} onClick={() => setDrawer(true)} sx={{ display: { lg: 'none' } }}>Learning path</Button>
    </Stack>
    {storageError && <Alert severity="warning" action={<Button onClick={resumeSaving}>Save this session</Button>}>{storageError}</Alert>}
    <Box sx={{ display: 'flex', maxWidth: 1560, mx: 'auto' }}>
      <Box component="aside" aria-label="Learning path" sx={{ display: { xs: 'none', lg: 'block' }, borderRight: '1px solid', borderColor: 'divider' }}>{sidebar}</Box>
      <Drawer open={drawer} onClose={() => setDrawer(false)}>{sidebar}</Drawer>
      <Box component="main" sx={{ flex: 1, minWidth: 0, p: { xs: 1.5, sm: compact ? 2 : 4, md: compact ? 3 : 5 } }}>
        {guidePanel}
        <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Typography sx={{ fontSize: 11, letterSpacing: 1.5, color: 'text.secondary' }}>{trackTitle.toUpperCase()} / {exercise.unit}</Typography>
          <Chip size="small" variant="outlined" label={skillStatus(data.progress, exercise, variants)} />
          {compact && <Button size="small" disabled={busy} onClick={() => setOrder(value => value === 'ordered' ? 'mixed' : 'ordered')} aria-label="Change practice order">{order === 'ordered' ? 'In order' : 'Mixed: current unit'}</Button>}
          <Button size="small" disabled={busy} onClick={() => setCatalog(true)} sx={{ ml: 'auto' }}>Browse exercises</Button>
        </Stack>
        <Typography component="h1" sx={{ fontSize: sample ? 17 : { xs: compact ? 23 : 28, sm: compact ? 27 : 36 }, fontWeight: 650, letterSpacing: '-0.5px', mb: 1.5 }}>{exercise.title}</Typography>
        <Box sx={{ p: 2, mb: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>

          <Typography sx={{ fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{exercise.prompt}</Typography>
          {exercise.argv && <Typography sx={{ mt: 1, fontFamily: mono, fontSize: 12 }}>Runner arguments: python {exercise.entry} {exercise.argv.join(' ')}</Typography>}
          {!sample && exercise.structures && <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 12 }}>Provided: ListNode(val, next), TreeNode(val, left, right), graph Node(val, neighbors), List, Optional, Counter, defaultdict, deque, heapq, math and lru_cache. Imports are also welcome.</Typography>}
          {!sample && exercise.url && <Button component="a" href={exercise.url} target="_blank" rel="noopener noreferrer" size="small">Original problem</Button>}
        </Box>
        {data.drafts[exercise.id] && data.progress.records[exercise.id]?.successes > 0 && <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 1 }}>Saved answer loaded. Refresh for a fresh attempt.</Typography>}
        {workspaceEditor}
        {solutionPanel}
        <FeedbackPanel result={result} />
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          {status !== 'ready' && <Typography role="status" sx={{ fontSize: 11, color: 'text.secondary' }}>{status === 'unavailable' ? 'Python could not load' : status === 'running' ? 'Running your code' : 'Preparing Python runtime...'}</Typography>}
          {status === 'unavailable' && <Button onClick={restart}>Retry loading</Button>}
          {compact ? <Button disabled={busy} onClick={next}>Skip for now</Button> : <Button disabled={!passed || busy} variant={passed ? 'contained' : 'text'} onClick={next}>Next rep →</Button>}
        </Stack>
      </Box>
    </Box>
    {dialogs}
  </Box>
}
