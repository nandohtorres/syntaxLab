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
import { useTheme } from '@mui/material/styles'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Popover from '@mui/material/Popover'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import Header from '@/components/Header'
import QuestionList from '@/components/QuestionList'
import QuestionPrompt from '@/components/QuestionPrompt'
import CodeEditor from '@/components/CodeEditor'
import FeedbackPanel from '@/components/FeedbackPanel'
import PopButton from '@/components/PopButton'
import { useQuestions } from '@/hooks/useQuestions'
import { usePyodide } from '@/hooks/usePyodide'
import { useProgressContext } from '@/context/ProgressContext'
import { runTestsAgainstUserCode } from '@/utils/testRunner'

const TEST_QUESTION = { id: '__test__', title: '🧪 Test Pop Button', prompt: 'This is a test question.', starterCode: '', tests: [], answer: '', pythonicTip: '', group: '', order: 0 }

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
  const [poppedIds, setPoppedIds] = useState(new Set())
  const [popInfoAnchor, setPopInfoAnchor] = useState(null)
  const [selectedEmblem, setSelectedEmblem] = useState('🚀')
  const [runFeedback, setRunFeedback] = useState(null) // null | 'correct' | 'incorrect'
  const [leftPanelWidth, setLeftPanelWidth] = useState(40)
  const [questionListHeightPct, setQuestionListHeightPct] = useState(35) // desktop: question list vs prompt
  const [mobileSplitPct, setMobileSplitPct] = useState(35)              // mobile: prompt vs editor

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

  // Vertical drag refs (prompt / editor, mobile)
  const isMobileVDraggingRef = useRef(false)
  const mobileContainerRef = useRef(null)
  const mobileVDragMoveHandlerRef = useRef(null)
  const mobileVDragEndHandlerRef = useRef(null)

  const feedbackTimerRef = useRef(null)
  const initialQuestionSelectedRef = useRef(false)

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

  function handleMobileVerticalDragStart(e) {
    e.preventDefault()
    isMobileVDraggingRef.current = true

    mobileVDragMoveHandlerRef.current = (moveEvent) => {
      if (!isMobileVDraggingRef.current || !mobileContainerRef.current) return
      moveEvent.preventDefault()
      const y = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY
      const rect = mobileContainerRef.current.getBoundingClientRect()
      const newPct = ((y - rect.top) / rect.height) * 100
      setMobileSplitPct(Math.min(60, Math.max(15, newPct)))
    }

    mobileVDragEndHandlerRef.current = () => {
      isMobileVDraggingRef.current = false
      document.removeEventListener('mousemove', mobileVDragMoveHandlerRef.current)
      document.removeEventListener('mouseup', mobileVDragEndHandlerRef.current)
      document.removeEventListener('touchmove', mobileVDragMoveHandlerRef.current)
      document.removeEventListener('touchend', mobileVDragEndHandlerRef.current)
    }

    document.addEventListener('mousemove', mobileVDragMoveHandlerRef.current)
    document.addEventListener('mouseup', mobileVDragEndHandlerRef.current)
    document.addEventListener('touchmove', mobileVDragMoveHandlerRef.current, { passive: false })
    document.addEventListener('touchend', mobileVDragEndHandlerRef.current)
  }

  useEffect(() => {
    return () => {
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
      if (mobileVDragMoveHandlerRef.current) {
        document.removeEventListener('mousemove', mobileVDragMoveHandlerRef.current)
        document.removeEventListener('touchmove', mobileVDragMoveHandlerRef.current)
      }
      if (mobileVDragEndHandlerRef.current) {
        document.removeEventListener('mouseup', mobileVDragEndHandlerRef.current)
        document.removeEventListener('touchend', mobileVDragEndHandlerRef.current)
      }
    }
  }, [])

  const EMBLEMS = [
    { emoji: '🚀', label: 'Rocket' },
    { emoji: '🎈', label: 'Balloon' },
    { emoji: '🫧', label: 'Bubble' },
    { emoji: '💣', label: 'Bomb' },
    { emoji: '⭐', label: 'Star' },
  ]

  function handleTestPopClick() {
    setSelectedQuestion(TEST_QUESTION)
    setTestRunResult(null)
    setRunFeedback(null)
    setAwaitingPopIds(prev => new Set(prev).add(TEST_QUESTION.id))
    setPoppedIds(prev => { const next = new Set(prev); next.delete(TEST_QUESTION.id); return next })
  }

  const handleQuestionSelect = useCallback((question) => {
    setSelectedQuestion(question)
    setTestRunResult(null)
    setRunFeedback(null)
    setPoppedIds(prev => { const next = new Set(prev); next.delete(question.id); return next })
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

  async function handleRunCode() {
    if (!pyodide || !selectedQuestion) return

    setIsRunningTests(true)
    setTestRunResult(null)

    const result = await runTestsAgainstUserCode(pyodide, userCode, selectedQuestion.tests)
    setTestRunResult(result)

    clearTimeout(feedbackTimerRef.current)
    setRunFeedback(result.passed ? 'correct' : 'incorrect')
    feedbackTimerRef.current = setTimeout(() => setRunFeedback(null), 1500)

    if (result.passed) {
      markQuestionAsComplete(selectedQuestion.id)
      if (!poppedIds.has(selectedQuestion.id)) {
        setAwaitingPopIds(prev => new Set(prev).add(selectedQuestion.id))
      }
    }

    setIsRunningTests(false)
  }

  function handlePopComplete() {
    const questionId = selectedQuestion.id
    setPoppedIds(prev => new Set(prev).add(questionId))
    setAwaitingPopIds(prev => { const next = new Set(prev); next.delete(questionId); return next })

    const currentIndex = questions.findIndex(q => q.id === questionId)
    const remaining = [...questions.slice(currentIndex + 1), ...questions.slice(0, currentIndex)]
    const nextQuestion = remaining.find(q => !isQuestionComplete(q.id)) ?? null
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
    flex: 1, overflow: 'hidden', borderRadius: 1, position: 'relative',
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

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 'clamp(320px, 97%, 1800px)',
          height: 'clamp(500px, 96dvh, 1080px)',
          borderRadius: 3,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        <Header />
        <Divider sx={{ mb: 2 }} />

        {isMobile ? (
          <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
            {/* Mobile: dropdown question selector */}
            <FormControl size="small" fullWidth sx={{ mb: 1, mt: 1, flexShrink: 0 }}>
              <InputLabel>Question</InputLabel>
              <Select
                value={selectedQuestion?.id ?? ''}
                label="Question"
                onChange={e => {
                  if (e.target.value === TEST_QUESTION.id) { handleTestPopClick(); return }
                  const q = questions.find(q => q.id === e.target.value)
                  if (q) handleQuestionSelect(q)
                }}
                MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
              >
                {import.meta.env.DEV && (
                  <MenuItem value={TEST_QUESTION.id}>{TEST_QUESTION.title}</MenuItem>
                )}
                {questions.map((q, i) => (
                  <MenuItem key={q.id} value={q.id}>
                    {i + 1}. {q.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Mobile: prompt + editor split with vertical drag handle */}
            <Box ref={mobileContainerRef} sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
              {/* Prompt + feedback — height controlled by drag (15%–60%) */}
              <Box sx={{ height: `${mobileSplitPct}%`, overflowY: 'auto', flexShrink: 0, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <QuestionPrompt key={selectedQuestion?.id} question={selectedQuestion} />
                <FeedbackPanel testRunResult={testRunResult} isRunning={isRunningTests} />
              </Box>

              {/* Mobile vertical drag handle */}
              <Box
                onMouseDown={handleMobileVerticalDragStart}
                onTouchStart={handleMobileVerticalDragStart}
                sx={{
                  height: '16px',
                  flexShrink: 0,
                  cursor: 'row-resize',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  '&:hover .drag-track': { bgcolor: 'primary.main' },
                  '&:hover .drag-pill': { borderColor: 'primary.main' },
                }}
              >
                <Box className="drag-track" sx={{ position: 'absolute', height: '2px', width: '100%', bgcolor: 'divider', borderRadius: 1, transition: 'background-color 0.15s' }} />
                <Box className="drag-pill"><DragHandlePill direction="row" /></Box>
              </Box>

              {/* Editor */}
              <Box sx={{ ...editorOutlineSx }}>
                <CodeEditor code={userCode} onCodeChange={(code) => setUserCodeMap(prev => ({ ...prev, [selectedQuestion.id]: code }))} />
                {selectedQuestion && awaitingPopIds.has(selectedQuestion.id) && (
                  <PopButton key={selectedQuestion.id} onPopped={handlePopComplete} emblem={selectedEmblem} />
                )}
              </Box>
            </Box>

            {/* Mobile: run button row — same as desktop, includes emblem selector */}
            {runButtonRow}
          </Box>
        ) : (
          <Box ref={containerRef} sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

            {/* Left Panel — question list, prompt, and feedback */}
            <Box ref={leftPanelRef} sx={{ width: `${leftPanelWidth}%`, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>

              {/* Question list — height controlled by drag (15%–65%) */}
              <Box sx={{ height: `${questionListHeightPct}%`, overflow: 'hidden', flexShrink: 0 }}>
                <QuestionList
                  questions={questions}
                  selectedQuestionId={selectedQuestion?.id}
                  onQuestionSelect={handleQuestionSelect}
                  testItem={TEST_QUESTION}
                  onTestItemClick={handleTestPopClick}
                />
              </Box>

              {/* Vertical drag handle (between list and prompt) */}
              <Box
                onMouseDown={handleVerticalDragStart}
                onTouchStart={handleVerticalDragStart}
                sx={{
                  height: '16px',
                  flexShrink: 0,
                  cursor: 'row-resize',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  '&:hover .drag-track': { bgcolor: 'primary.main' },
                  '&:hover .drag-pill': { borderColor: 'primary.main' },
                }}
              >
                <Box className="drag-track" sx={{ position: 'absolute', height: '2px', width: '100%', bgcolor: 'divider', borderRadius: 1, transition: 'background-color 0.15s' }} />
                <Box className="drag-pill"><DragHandlePill direction="row" /></Box>
              </Box>

              {/* Prompt + feedback — fills remaining space */}
              <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <QuestionPrompt key={selectedQuestion?.id} question={selectedQuestion} />
                <FeedbackPanel testRunResult={testRunResult} isRunning={isRunningTests} />
              </Box>
            </Box>

            {/* Horizontal drag handle (between left and right panels) */}
            <Box
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              sx={{
                width: '16px',
                flexShrink: 0,
                cursor: 'col-resize',
                mx: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                '&:hover .drag-track': { bgcolor: 'primary.main' },
                '&:hover .drag-pill': { borderColor: 'primary.main' },
              }}
            >
              <Box className="drag-track" sx={{ position: 'absolute', width: '2px', height: '100%', bgcolor: 'divider', borderRadius: 1, transition: 'background-color 0.15s' }} />
              <Box className="drag-pill"><DragHandlePill direction="col" /></Box>
            </Box>

            {/* Right Panel — code editor and run button */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Box sx={{ ...editorOutlineSx }}>
                <CodeEditor code={userCode} onCodeChange={(code) => setUserCodeMap(prev => ({ ...prev, [selectedQuestion.id]: code }))} />
                {selectedQuestion && awaitingPopIds.has(selectedQuestion.id) && (
                  <PopButton key={selectedQuestion.id} onPopped={handlePopComplete} emblem={selectedEmblem} />
                )}
              </Box>
              {runButtonRow}
            </Box>

          </Box>
        )}
      </Paper>

      {/* Floating loading island — fades away once Pyodide is ready */}
      <Backdrop
        open={isInitialLoading}
        sx={{ zIndex: 10, backdropFilter: 'blur(3px)', bgcolor: 'rgba(0,0,0,0.35)' }}
      >
        <Fade in={isInitialLoading}>
          <Paper
            elevation={12}
            sx={{
              px: 4, py: 3,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
              border: '1px solid',
              borderColor: 'primary.main',
              bgcolor: 'background.paper',
              minWidth: 240,
            }}
          >
            <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>🐍</Typography>
            <CircularProgress size={28} thickness={4} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" fontWeight={700} color="text.primary" gutterBottom>
                {isLoadingPyodide ? 'Starting Python Runtime' : 'Loading Questions'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isLoadingPyodide ? 'Pyodide is spinning up in your browser…' : 'Fetching exercises from the server…'}
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Backdrop>
    </Box>
  )
}
