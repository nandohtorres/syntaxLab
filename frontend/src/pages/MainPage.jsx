import { useState, useEffect, useCallback, useRef } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ThemeProvider, useTheme } from '@mui/material/styles'
import practiceTheme from '@practice/practiceTheme.js'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Popover from '@mui/material/Popover'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
import QuestionList from '@/components/QuestionList'
import QuestionPrompt from '@/components/QuestionPrompt'
import CodeEditor from '@/components/CodeEditor'
import FeedbackPanel from '@/components/FeedbackPanel'
import PopButton from '@/components/PopButton'
import { useQuestions } from '@/hooks/useQuestions'
import { usePyodide } from '@/hooks/usePyodide'
import { useProgressContext } from '@/context/ProgressContext'
import { runTestsAgainstUserCode } from '@/utils/testRunner'
import { useStudyLayout } from '@practice/layoutContext.js'
import StudyWorkspace from '@practice/StudyWorkspace.jsx'
import StudyLibrary from '@practice/StudyLibrary.jsx'

const TEST_QUESTION = { id: '__test__', title: '🧪 Test Pop Button', prompt: 'This is a test question.', starterCode: '', tests: [], answer: '', pythonicTip: '', group: '', order: 0 }

const EMBLEMS = [
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '🎈', label: 'Balloon' },
  { emoji: '🫧', label: 'Bubble' },
  { emoji: '💣', label: 'Bomb' },
  { emoji: '⭐', label: 'Star' },
]

// direction: 'col' for left-right drag handles, 'row' for up-down drag handles.
function DragHandlePill({ direction }) {
  const isCol = direction === 'col'
  return (
    <Box sx={{
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: isCol ? 1.5 : 1,
      px: isCol ? 1 : 1.5,
      borderRadius: 2,
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      transition: 'border-color 0.15s',
      pointerEvents: 'none',
    }}>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: isCol ? 'repeat(2, 4px)' : 'repeat(3, 4px)',
        gap: '3px',
      }}>
        {Array(6).fill(0).map((_, i) => (
          <Box key={i} sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.disabled' }} />
        ))}
      </Box>
    </Box>
  )
}

export default function MainPage() {
  const layout = useStudyLayout()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { questions, isLoading: isLoadingQuestions, fetchError } = useQuestions()
  const { pyodide, isLoading: isLoadingPyodide, loadError } = usePyodide()
  const { markQuestionAsComplete, isQuestionComplete } = useProgressContext()

  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [userCodeMap, setUserCodeMap] = useState(() => {
    try { return JSON.parse(localStorage.getItem('synlab_code') || '{}') } catch { return {} }
  })
  const userCode = selectedQuestion ? (userCodeMap[selectedQuestion.id] ?? selectedQuestion.starterCode) : ''

  useEffect(() => {
    localStorage.setItem('synlab_code', JSON.stringify(userCodeMap))
  }, [userCodeMap])
  const [testRunResult, setTestRunResult] = useState(null)
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [awaitingPopIds, setAwaitingPopIds] = useState(new Set())
  const [popInfoAnchor, setPopInfoAnchor] = useState(null)
  const [selectedEmblem, setSelectedEmblem] = useState('🚀')
  const [runFeedback, setRunFeedback] = useState(null) // null | 'correct' | 'incorrect'
  const [leftPanelWidth, setLeftPanelWidth] = useState(40)
  const [questionListHeightPct, setQuestionListHeightPct] = useState(35) // desktop: question list vs prompt

  // Horizontal drag refs (left/right panels, desktop)
  const isDraggingRef = useRef(false)
  const containerRef = useRef(null)
  const dragMoveHandlerRef = useRef(null)
  const dragEndHandlerRef = useRef(null)

  // Vertical drag refs (question list / prompt, desktop)
  const isVDraggingRef = useRef(false)
  const leftPanelRef = useRef(null)
  const vDragMoveHandlerRef = useRef(null)
  const vDragEndHandlerRef = useRef(null)

  const feedbackTimerRef = useRef(null)
  const initialQuestionSelectedRef = useRef(false)

  // Always-fresh refs for values used inside async callbacks (avoids stale closures)
  const selectedQuestionRef = useRef(selectedQuestion)
  const isQuestionCompleteRef = useRef(isQuestionComplete)
  useEffect(() => {
    selectedQuestionRef.current = selectedQuestion
    isQuestionCompleteRef.current = isQuestionComplete
  })

  // Store handlers in refs so the same function reference is used for both
  // addEventListener and removeEventListener — plain functions recreated each render
  // would cause removeEventListener to silently fail, leaking the listeners.
  function handleDragStart(e) {
    e.preventDefault()
    isDraggingRef.current = true

    dragMoveHandlerRef.current = (moveEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return
      const x = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX
      const containerRect = containerRef.current.getBoundingClientRect()
      const newWidthPct = ((x - containerRect.left) / containerRect.width) * 100
      setLeftPanelWidth(Math.min(60, Math.max(25, newWidthPct)))
    }

    dragEndHandlerRef.current = () => {
      isDraggingRef.current = false
      document.removeEventListener('mousemove', dragMoveHandlerRef.current)
      document.removeEventListener('mouseup', dragEndHandlerRef.current)
      document.removeEventListener('touchmove', dragMoveHandlerRef.current)
      document.removeEventListener('touchend', dragEndHandlerRef.current)
    }

    document.addEventListener('mousemove', dragMoveHandlerRef.current)
    document.addEventListener('mouseup', dragEndHandlerRef.current)
    document.addEventListener('touchmove', dragMoveHandlerRef.current, { passive: false })
    document.addEventListener('touchend', dragEndHandlerRef.current)
  }

  function handleVerticalDragStart(e) {
    e.preventDefault()
    isVDraggingRef.current = true

    vDragMoveHandlerRef.current = (moveEvent) => {
      if (!isVDraggingRef.current || !leftPanelRef.current) return
      moveEvent.preventDefault()
      const y = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY
      const rect = leftPanelRef.current.getBoundingClientRect()
      const newPct = ((y - rect.top) / rect.height) * 100
      setQuestionListHeightPct(Math.min(65, Math.max(15, newPct)))
    }

    vDragEndHandlerRef.current = () => {
      isVDraggingRef.current = false
      document.removeEventListener('mousemove', vDragMoveHandlerRef.current)
      document.removeEventListener('mouseup', vDragEndHandlerRef.current)
      document.removeEventListener('touchmove', vDragMoveHandlerRef.current)
      document.removeEventListener('touchend', vDragEndHandlerRef.current)
    }

    document.addEventListener('mousemove', vDragMoveHandlerRef.current)
    document.addEventListener('mouseup', vDragEndHandlerRef.current)
    document.addEventListener('touchmove', vDragMoveHandlerRef.current, { passive: false })
    document.addEventListener('touchend', vDragEndHandlerRef.current)
  }

  useEffect(() => {
    return () => {
      clearTimeout(feedbackTimerRef.current)
      if (dragMoveHandlerRef.current) document.removeEventListener('mousemove', dragMoveHandlerRef.current)
      if (dragEndHandlerRef.current) document.removeEventListener('mouseup', dragEndHandlerRef.current)
      if (vDragMoveHandlerRef.current) {
        document.removeEventListener('mousemove', vDragMoveHandlerRef.current)
        document.removeEventListener('touchmove', vDragMoveHandlerRef.current)
      }
      if (vDragEndHandlerRef.current) {
        document.removeEventListener('mouseup', vDragEndHandlerRef.current)
        document.removeEventListener('touchend', vDragEndHandlerRef.current)
      }
    }
  }, [])

  function handleTestPopClick() {
    setSelectedQuestion(TEST_QUESTION)
    setTestRunResult(null)
    setRunFeedback(null)
    setAwaitingPopIds(prev => new Set(prev).add(TEST_QUESTION.id))
  }

  const handleQuestionSelect = useCallback((question) => {
    setSelectedQuestion(question)
    setTestRunResult(null)
    setRunFeedback(null)
  }, [])

  // Runs once when questions first load from the API — selects the first incomplete question.
  // initialQuestionSelectedRef prevents this from re-running when isQuestionComplete changes
  // (e.g. after completing a question), which would skip the pop animation and reset the editor.
  useEffect(() => {
    if (questions.length === 0 || initialQuestionSelectedRef.current) return
    initialQuestionSelectedRef.current = true
    const firstIncomplete = questions.find(q => !isQuestionComplete(q.id)) ?? questions[0]
    setSelectedQuestion(firstIncomplete)
    setTestRunResult(null)
  }, [questions, isQuestionComplete])

  async function handleRunCode(editorValue) {
    if (!pyodide || !selectedQuestion || isRunningTests) return

    setIsRunningTests(true)
    setTestRunResult(null)

    const result = await runTestsAgainstUserCode(pyodide, typeof editorValue === 'string' ? editorValue : userCode, selectedQuestion.tests)
    setTestRunResult(result)

    clearTimeout(feedbackTimerRef.current)
    setRunFeedback(result.passed ? 'correct' : 'incorrect')
    feedbackTimerRef.current = setTimeout(() => setRunFeedback(null), 1500)

    if (result.passed) {
      markQuestionAsComplete(selectedQuestion.id)
      setAwaitingPopIds(prev => new Set(prev).add(selectedQuestion.id))
    }

    setIsRunningTests(false)
  }

  function handlePopComplete() {
    const questionId = selectedQuestionRef.current.id
    setAwaitingPopIds(prev => { const next = new Set(prev); next.delete(questionId); return next })

    const currentIndex = questions.findIndex(q => q.id === questionId)
    const remaining = [...questions.slice(currentIndex + 1), ...questions.slice(0, currentIndex)]
    const nextQuestion = remaining.find(q => !isQuestionCompleteRef.current(q.id)) ?? remaining[0] ?? null
    if (nextQuestion) handleQuestionSelect(nextQuestion)
  }

  const isInitialLoading = isLoadingQuestions || isLoadingPyodide
  const errorMessage = fetchError || loadError

  if (errorMessage) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{errorMessage}</Typography>
      </Box>
    )
  }

  const editorOutlineSx = {
    flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative',
    border: '1px solid',
    borderColor: 'divider',
    outline: runFeedback === 'correct' ? '2px solid #4caf50' : runFeedback === 'incorrect' ? '2px solid #f44336' : '2px solid transparent',
    transition: 'outline-color 0.15s',
    animation: runFeedback === 'incorrect' ? 'shake 0.4s ease' : 'none',
    '@keyframes shake': {
      '0%, 100%': { transform: 'translateX(0)' },
      '20%': { transform: 'translateX(-6px)' },
      '40%': { transform: 'translateX(6px)' },
      '60%': { transform: 'translateX(-4px)' },
      '80%': { transform: 'translateX(4px)' },
    },
  }

  const runButtonRow = (
    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
      {selectedQuestion && awaitingPopIds.has(selectedQuestion.id) ? (
        <>
          <Box
            onClick={e => setPopInfoAnchor(popInfoAnchor ? null : e.currentTarget)}
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.75,
              px: 1.5, py: 1, borderRadius: 1.5, cursor: 'pointer',
              border: '1px solid', borderColor: popInfoAnchor ? 'primary.main' : 'divider',
              transition: 'border-color 0.2s',
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: '1.1rem', color: 'text.disabled' }} />
            <Typography sx={{ fontSize: '1.2rem', lineHeight: 1 }}>{selectedEmblem}</Typography>
            <Popover
              open={Boolean(popInfoAnchor)}
              anchorEl={popInfoAnchor}
              onClose={() => setPopInfoAnchor(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              disableRestoreFocus
              slotProps={{
                paper: {
                  sx: {
                    p: 2.5, maxWidth: 380,
                    bgcolor: 'background.paper',
                    border: '1px solid', borderColor: 'primary.main',
                    borderRadius: 2, boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                  }
                }
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.75 }}>
                Why the {selectedEmblem}?
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.7, display: 'block', mb: 1 }}>
                Clicking rapidly to advance is intentional. Each click triggers a small dopamine release, and the physical act of clicking builds a motor-memory circuit — your brain begins associating the sensation of clicking with the reward of solving.
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.7, display: 'block', mb: 1.5 }}>
                Over time, that circuit strengthens. Your brain starts seeking the feeling of solving problems, not just getting through them — which is exactly the habit that leads to real skill.
              </Typography>
              <Divider sx={{ mb: 1.5, borderColor: 'divider' }} />
              <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 0.75 }}>
                Choose your emblem
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.75 }}>
                {EMBLEMS.map(({ emoji, label }) => (
                  <Box
                    key={emoji}
                    onClick={() => setSelectedEmblem(emoji)}
                    title={label}
                    sx={{
                      fontSize: '1.8rem', cursor: 'pointer', p: 0.75, borderRadius: 1,
                      border: '1px solid',
                      borderColor: selectedEmblem === emoji ? 'primary.main' : 'transparent',
                      bgcolor: selectedEmblem === emoji ? 'primary.main' + '18' : 'transparent',
                      transition: 'border-color 0.15s, background-color 0.15s',
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.main' + '12' },
                    }}
                  >
                    {emoji}
                  </Box>
                ))}
              </Box>
            </Popover>
          </Box>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handlePopComplete}
            startIcon={<CheckCircleIcon sx={{ color: '#4caf50' }} />}
            endIcon={<ArrowForwardIcon />}
          >
            Next Question
          </Button>
        </>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
          <Button
            variant="contained"
            onClick={handleRunCode}
            disabled={!selectedQuestion || isRunningTests || !pyodide}
            color={runFeedback === 'incorrect' ? 'error' : 'primary'}
            startIcon={
              isRunningTests
                ? <CircularProgress size={16} color="inherit" />
                : <PlayArrowIcon />
            }
          >
            Run
          </Button>
        </Box>
      )}
    </Box>
  )

  const desktop = '@media (min-width: 900px) and (min-height: 640px)'
  const panel = { border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }
  const completedCount = questions.filter(question => isQuestionComplete(question.id)).length
  const resizeKey = (event, setter, current, min, max, vertical = false) => {
    const decrease = vertical ? 'ArrowUp' : 'ArrowLeft'
    const increase = vertical ? 'ArrowDown' : 'ArrowRight'
    if (event.key === decrease || event.key === increase) {
      event.preventDefault()
      setter(Math.min(max, Math.max(min, current + (event.key === increase ? 2 : -2))))
    }
  }
  const prompt = <Box component="section" aria-labelledby="exercise-title" tabIndex={0} sx={{ ...panel, flex: 1, minHeight: 0, [desktop]: { overflowY: 'auto' } }}>
    <QuestionPrompt key={selectedQuestion?.id} question={selectedQuestion} />
    <Box aria-live="polite" sx={{ px: 2.5, pb: testRunResult || isRunningTests ? 2 : 0 }}><FeedbackPanel testRunResult={testRunResult} isRunning={isRunningTests} /></Box>
  </Box>

  if (layout !== 'current') {
    const island = layout === 'island'
    const demoDesktop = '@media (min-width: 900px) and (min-height: 760px)'
    const items = questions.map(question => ({ id: question.id, title: question.title, group: question.group, done: isQuestionComplete(question.id) }))
    return <StudyWorkspace
      title="LeetCode Python"
      subtitle="The Python operations you reach for when solving problems."
      library={<StudyLibrary items={items} selectedId={selectedQuestion?.id} choose={id => { const question = questions.find(item => item.id === id); if (question) handleQuestionSelect(question) }} disabled={isRunningTests} />}
      prompt={<QuestionPrompt key={selectedQuestion?.id} question={selectedQuestion} />}
      editor={<ThemeProvider theme={practiceTheme}><Box sx={{ border: '1px solid #2c394b', borderRadius: 2, overflow: 'hidden', bgcolor: '#101722', display: 'flex', flexDirection: 'column', ...(island && { [demoDesktop]: { flex: 1, minHeight: 0 } }) }}>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, borderBottom: '1px solid #2c394b', color: '#d7e3f3', bgcolor: '#151e2b', flexShrink: 0 }}><Typography sx={{ fontFamily: 'Consolas, monospace', fontSize: 12 }}>main.py</Typography><Typography sx={{ ml: 'auto', color: '#8d9bb0', fontSize: 11 }}>Browser Python</Typography></Box>
        <Box sx={{ ...editorOutlineSx, height: { xs: 260, md: 280 }, flex: 'none', ...(island && { [demoDesktop]: { height: 'auto', flex: 1, minHeight: 100 } }) }}><CodeEditor code={userCode} onRun={handleRunCode} onNext={() => { if (selectedQuestion && awaitingPopIds.has(selectedQuestion.id)) handlePopComplete() }} onCodeChange={code => { if (!selectedQuestion) return; setUserCodeMap(previous => ({ ...previous, [selectedQuestion.id]: code })) }} /></Box>
        <Box sx={{ px: 1.5, py: 1.5, borderTop: '1px solid #2c394b', display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
          <Box sx={{ flex: 1 }} />
          <Button variant="contained" onClick={handleRunCode} disabled={!selectedQuestion || isRunningTests || !pyodide}>Run code</Button>
          <Button variant={selectedQuestion && awaitingPopIds.has(selectedQuestion.id) ? 'contained' : 'outlined'} onClick={handlePopComplete} disabled={!selectedQuestion || !awaitingPopIds.has(selectedQuestion.id) || isRunningTests}>Next rep</Button>
        </Box>
      </Box></ThemeProvider>}
      feedback={isInitialLoading ? <Box role="status" sx={{ p: 1.5, fontSize: 12, color: 'text.secondary' }}>Loading Python and exercises...</Box> : <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5 }}><FeedbackPanel testRunResult={testRunResult} isRunning={isRunningTests} />{!testRunResult && !isRunningTests && <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Write it. Run it. See what happens.</Typography>}</Box>}
      footer={<Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Code and progress stay in this browser.</Typography>}
    />
  }

  return <Box component="main" sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', [desktop]: { flex: 1, minHeight: 0 } }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2, flexShrink: 0 }}>
      <Box><Typography sx={{ fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', fontWeight: 700, color: 'primary.main', mb: 0.6 }}>Your practice workspace</Typography><Typography component="h1" sx={{ fontSize: { xs: 23, md: 30 }, fontWeight: 650, letterSpacing: '-0.7px' }}>Build fluency, one rep at a time.</Typography></Box>
      <Box sx={{ minWidth: 90, textAlign: 'right' }}><Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 1 }}>{completedCount} / {questions.length} passed</Typography><LinearProgress aria-label="Completed exercises" variant="determinate" value={questions.length ? completedCount / questions.length * 100 : 0} sx={{ height: 4, borderRadius: 3 }} /></Box>
    </Box>
    <Box ref={containerRef} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 0 }, [desktop]: { flex: 1, minHeight: 0 } }}>
      <Box ref={leftPanelRef} sx={{ width: { xs: '100%', md: leftPanelWidth + '%' }, minWidth: 0, flexShrink: 0, display: 'flex', flexDirection: 'column', [desktop]: { minHeight: 0 } }}>
        {isMobile ? <FormControl size="small" fullWidth sx={{ mb: 2 }}>
          <InputLabel id="question-selector-label">Question</InputLabel>
          <Select labelId="question-selector-label" value={selectedQuestion?.id ?? ''} label="Question" onChange={event => {
            if (event.target.value === TEST_QUESTION.id) { handleTestPopClick(); return }
            const question = questions.find(item => item.id === event.target.value)
            if (question) handleQuestionSelect(question)
          }} MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}>
            {import.meta.env.DEV && <MenuItem value={TEST_QUESTION.id}>{TEST_QUESTION.title}</MenuItem>}
            {questions.map((question, index) => <MenuItem key={question.id} value={question.id}>{index + 1}. {question.title}</MenuItem>)}
          </Select>
        </FormControl> : <>
          <Box component="section" aria-label="Practice exercises" sx={{ ...panel, overflow: 'hidden', height: 235, display: 'flex', flexDirection: 'column', flexShrink: 0, [desktop]: { height: questionListHeightPct + '%', minHeight: 90 } }}>
            <Typography sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary', flexShrink: 0 }}>Exercise library</Typography>
            <Box sx={{ flex: 1, minHeight: 0 }}><QuestionList questions={questions} selectedQuestionId={selectedQuestion?.id} onQuestionSelect={handleQuestionSelect} testItem={TEST_QUESTION} onTestItemClick={handleTestPopClick} /></Box>
          </Box>
          <Box role="separator" aria-label="Resize exercise library" aria-orientation="horizontal" aria-valuemin={15} aria-valuemax={65} aria-valuenow={questionListHeightPct} tabIndex={0} onKeyDown={event => resizeKey(event, setQuestionListHeightPct, questionListHeightPct, 15, 65, true)} onMouseDown={handleVerticalDragStart} onTouchStart={handleVerticalDragStart} sx={{ height: 16, flexShrink: 0, cursor: 'row-resize', display: 'flex', alignItems: 'center', justifyContent: 'center', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } }}><DragHandlePill direction="row" /></Box>
        </>}
        {prompt}
      </Box>
      {!isMobile && <Box role="separator" aria-label="Resize practice panels" aria-orientation="vertical" aria-valuemin={25} aria-valuemax={60} aria-valuenow={leftPanelWidth} tabIndex={0} onKeyDown={event => resizeKey(event, setLeftPanelWidth, leftPanelWidth, 25, 60)} onMouseDown={handleDragStart} onTouchStart={handleDragStart} sx={{ width: 20, flexShrink: 0, cursor: 'col-resize', display: 'flex', alignItems: 'center', justifyContent: 'center', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } }}><DragHandlePill direction="col" /></Box>}
      <Box component="section" aria-label="Code workspace" sx={{ ...panel, overflow: 'hidden', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', [desktop]: { minHeight: 0 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2.5, py: 1.6, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0, bgcolor: theme => theme.palette.mode === 'dark' ? '#151e2b' : '#f0f6f3' }}><Typography sx={{ fontFamily: 'Consolas, monospace', fontSize: 13 }}><Box component="span" sx={{ color: 'primary.main', mr: 1.5 }}>py</Box>main.py</Typography><Typography sx={{ ml: 'auto', color: 'text.secondary', fontSize: 11 }}>Python ? browser runner</Typography></Box>
        <Box sx={{ ...editorOutlineSx, height: 400, flex: 'none', [desktop]: { height: 'auto', flex: 1 } }}>
          <CodeEditor code={userCode} onCodeChange={code => { if (!selectedQuestion) return; setUserCodeMap(previous => ({ ...previous, [selectedQuestion.id]: code })) }} />
          {selectedQuestion && awaitingPopIds.has(selectedQuestion.id) && <PopButton key={selectedQuestion.id} onPopped={handlePopComplete} emblem={selectedEmblem} />}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}><Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: pyodide ? 'primary.main' : 'text.disabled' }} /><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{isRunningTests ? 'Running?' : pyodide ? 'Ready to run' : 'Starting Python?'}</Typography><Typography sx={{ ml: 'auto', fontSize: 11, color: 'text.secondary' }}>Code stays in your browser</Typography></Box>
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}>{runButtonRow}</Box>
      </Box>
    </Box>
    <Backdrop open={isInitialLoading} sx={{ zIndex: 10, backdropFilter: 'blur(3px)', bgcolor: 'rgba(0,0,0,0.35)' }}>
      <Fade in={isInitialLoading}><Paper elevation={12} sx={{ px: 4, py: 3, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, border: '1px solid', borderColor: 'primary.main', minWidth: 240 }}><CircularProgress size={28} /><Typography fontWeight={700}>{isLoadingPyodide ? 'Starting Python Runtime' : 'Loading Questions'}</Typography><Typography variant="caption" color="text.secondary">{isLoadingPyodide ? 'Python runs in your browser.' : 'Fetching exercises from the server?'}</Typography></Paper></Fade>
    </Backdrop>
  </Box>
}
