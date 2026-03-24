import { useState, useEffect, useCallback, useRef } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
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

export default function MainPage() {
  const { questions, isLoading: isLoadingQuestions, fetchError } = useQuestions()
  const { pyodide, isLoading: isLoadingPyodide, loadError } = usePyodide()
  const { markQuestionAsComplete, isQuestionComplete } = useProgressContext()

  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [userCode, setUserCode] = useState('')
  const [testRunResult, setTestRunResult] = useState(null)
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [awaitingPopIds, setAwaitingPopIds] = useState(new Set())
  const [poppedIds, setPoppedIds] = useState(new Set())
  const [popInfoAnchor, setPopInfoAnchor] = useState(null)
  const [selectedEmblem, setSelectedEmblem] = useState('🚀')
  const closeTimerRef = useRef(null)

  const EMBLEMS = [
    { emoji: '🚀', label: 'Rocket' },
    { emoji: '🎈', label: 'Balloon' },
    { emoji: '🫧', label: 'Bubble' },
    { emoji: '💣', label: 'Bomb' },
    { emoji: '⭐', label: 'Star' },
  ]

  function handleEmblemHoverOpen(e) {
    clearTimeout(closeTimerRef.current)
    setPopInfoAnchor(e.currentTarget)
  }

  function handleEmblemHoverClose() {
    closeTimerRef.current = setTimeout(() => setPopInfoAnchor(null), 120)
  }

  function handleTestPopClick() {
    setSelectedQuestion(TEST_QUESTION)
    setUserCode('')
    setTestRunResult(null)
    setAwaitingPopIds(prev => new Set(prev).add(TEST_QUESTION.id))
    setPoppedIds(prev => { const next = new Set(prev); next.delete(TEST_QUESTION.id); return next })
  }

  const handleQuestionSelect = useCallback((question) => {
    setSelectedQuestion(question)
    setUserCode(question.starterCode)
    setTestRunResult(null)
  }, [])

  useEffect(() => {
    if (questions.length === 0) return
    const firstIncomplete = questions.find(q => !isQuestionComplete(q.id)) ?? questions[0]
    setSelectedQuestion(firstIncomplete)
    setUserCode(firstIncomplete.starterCode)
    setTestRunResult(null)
  }, [questions, isQuestionComplete])

  async function handleRunCode() {
    if (!pyodide || !selectedQuestion) return

    setIsRunningTests(true)
    setTestRunResult(null)

    const result = await runTestsAgainstUserCode(pyodide, userCode, selectedQuestion.tests)
    setTestRunResult(result)

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

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '85%',
          height: '85vh',
          borderRadius: 3,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        <Header />
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flex: 1, gap: 2, overflow: 'hidden' }}>

          {/* Left Panel — question list, prompt, and feedback */}
          <Box sx={{ width: '40%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <QuestionList
              questions={questions}
              selectedQuestionId={selectedQuestion?.id}
              onQuestionSelect={handleQuestionSelect}
              testItem={TEST_QUESTION}
              onTestItemClick={handleTestPopClick}
            />
            <Divider sx={{ my: 1.5, borderColor: 'primary.main', opacity: 0.4, borderBottomWidth: 2 }} />
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              <QuestionPrompt question={selectedQuestion} />
              <FeedbackPanel testRunResult={testRunResult} isRunning={isRunningTests} />
            </Box>
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* Right Panel — code editor and run button */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ flex: 1, overflow: 'hidden', borderRadius: 1, position: 'relative' }}>
              <CodeEditor code={userCode} onCodeChange={setUserCode} />
              {selectedQuestion && awaitingPopIds.has(selectedQuestion.id) && (
                <PopButton key={selectedQuestion.id} onPopped={handlePopComplete} emblem={selectedEmblem} />
              )}
            </Box>
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {selectedQuestion && awaitingPopIds.has(selectedQuestion.id) ? (
                <>
                  <Box
                    onMouseEnter={handleEmblemHoverOpen}
                    onMouseLeave={handleEmblemHoverClose}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 0.5,
                      px: 1, py: 0.5, borderRadius: 1.5, cursor: 'default',
                      border: '1px solid', borderColor: popInfoAnchor ? 'primary.main' : 'divider',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <InfoOutlinedIcon sx={{ fontSize: '0.9rem', color: 'text.disabled' }} />
                    <Typography sx={{ fontSize: '0.9rem', lineHeight: 1 }}>{selectedEmblem}</Typography>
                    <Popover
                      open={Boolean(popInfoAnchor)}
                      anchorEl={popInfoAnchor}
                      onClose={() => setPopInfoAnchor(null)}
                      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      disableRestoreFocus
                      slotProps={{
                        paper: {
                          onMouseEnter: () => clearTimeout(closeTimerRef.current),
                          onMouseLeave: handleEmblemHoverClose,
                          sx: {
                            p: 2, maxWidth: 300,
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
                              fontSize: '1.3rem', cursor: 'pointer', p: 0.5, borderRadius: 1,
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
          </Box>

        </Box>
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
