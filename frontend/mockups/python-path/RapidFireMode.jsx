import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, IconButton, LinearProgress, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography, useMediaQuery } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { insertNewlineAndIndent } from '@codemirror/commands'

import CodeSurface from './CodeSurface.jsx'
import CodeDrawer from './CodeDrawer.jsx'
import SymbolKeys from './SymbolKeys.jsx'
import { PHONE_LAYOUT_QUERY } from './layoutContext.js'
import { mono } from './editorSupport.js'
import usePracticeRunner from './usePracticeRunner.js'
import RapidFireTimer from './RapidFireTimer.jsx'
import RapidFireTask from './RapidFireTask.jsx'
import RapidFireDataBank from './RapidFireDataBank.jsx'
import { FULL_RUN_ID, RAPID_FIRE_LEVELS, RAPID_FIRE_STORAGE_KEY, elapsedMs, formatDuration } from './content/rapidFire.js'

const EDITOR_LINE_HEIGHT = 27
// Typed text lines up with the "Type this" example: its 16px padding = the editor's 2px border + 14px inset,
// and 11px top padding plus CodeMirror's 4px content padding lands on the example's first line.
const EDITOR_BORDER = 2
const EXAMPLE_PADDING_X = 16
const EDITOR_PADDING_TOP = 11
const SAVED_RUN_LIMIT = 100
const FRESH_HIGHLIGHT_MS = 900
const IDLE_CLOCK = { startedAt: null, finishedAt: null, pausedAt: null, pausedMs: 0 }

function loadStore() {
  try { return JSON.parse(localStorage.getItem(RAPID_FIRE_STORAGE_KEY) || '{}') } catch { return {} }
}

function saveStore(changes) {
  try { localStorage.setItem(RAPID_FIRE_STORAGE_KEY, JSON.stringify({ ...loadStore(), ...changes })) } catch { /* the run still shows on screen */ }
}

// Runs saved before levels existed were all full runs.
const levelOfRun = saved => saved.level ?? FULL_RUN_ID

function bestOf(runs, levelId) {
  const times = runs.filter(saved => levelOfRun(saved) === levelId).map(saved => saved.ms)
  return times.length ? Math.min(...times) : null
}

function findLevel(levelId) {
  return RAPID_FIRE_LEVELS.find(level => level.id === levelId) ?? RAPID_FIRE_LEVELS[0]
}

// Newest first, so the bubble that just changed is always in view.
function startingBubbles(level) {
  return Object.entries(level.startingData).reverse()
}

function lineCount(text) {
  return text ? text.split('\n').length : 0
}

function resumedClock(clock, now = Date.now()) {
  return clock.pausedAt ? { ...clock, pausedAt: null, pausedMs: clock.pausedMs + now - clock.pausedAt } : clock
}

// The runner reports errors against the whole program; point them at the learner's own lines instead.
function readableFailure(message, step, linesBefore) {
  if (!message) return 'That run took too long. Check for an endless loop.'
  const withoutLabel = message.startsWith(`${step.task}: `) ? message.slice(step.task.length + 2) : message
  if (withoutLabel === 'The result did not match this check.') return 'Not quite. Match the example.'
  return withoutLabel
    .replace(/main\.py, /g, '')
    .replace(/\bline (\d+)/g, (_, line) => `line ${Math.max(1, Number(line) - linesBefore)}`)
}

export default function RapidFireMode({ onExit }) {
  const { status, run, restart } = usePracticeRunner()
  const [levelId, setLevelId] = useState(() => findLevel(loadStore().lastLevel).id)
  const level = findLevel(levelId)
  const [stepIndex, setStepIndex] = useState(0)
  const [acceptedCode, setAcceptedCode] = useState(level.startingCode)
  const [bubbles, setBubbles] = useState(() => startingBubbles(level))
  const [freshNames, setFreshNames] = useState([])
  const [clock, setClock] = useState(IDLE_CLOCK)
  const [misses, setMisses] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const [runs, setRuns] = useState(() => loadStore().runs ?? [])
  const [clockHidden, setClockHidden] = useState(() => Boolean(loadStore().hideClock))
  // Each submit gets a token; switching level bumps it so a run still in flight can't apply its result.
  const submitToken = useRef(0)
  const runInFlight = useRef(false)
  const refocusAfterRep = useRef(false)
  const clockRef = useRef(IDLE_CLOCK)
  const submitRef = useRef(null)
  const editorRef = useRef(null)
  const phone = useMediaQuery(PHONE_LAYOUT_QUERY)
  const flashTimer = useRef(null)
  const freshTimer = useRef(null)

  const steps = level.steps
  const step = steps[stepIndex]
  const finished = clock.finishedAt !== null
  const bestMs = bestOf(runs, levelId)
  const levelIndex = RAPID_FIRE_LEVELS.indexOf(level)
  const nextLevel = level.id !== FULL_RUN_ID ? RAPID_FIRE_LEVELS[levelIndex + 1] : null

  const startLevel = useCallback(nextLevelId => {
    const chosen = findLevel(nextLevelId)
    clearTimeout(flashTimer.current)
    clearTimeout(freshTimer.current)
    submitToken.current += 1
    setLevelId(chosen.id)
    setStepIndex(0)
    setAcceptedCode(chosen.startingCode)
    setBubbles(startingBubbles(chosen))
    setFreshNames([])
    setClock(IDLE_CLOCK)
    setMisses(0)
    setFeedback(null)
    setAttempt(value => value + 1)
    saveStore({ lastLevel: chosen.id })
  }, [])

  const submit = useCallback(async value => {
    const typed = value.replace(/\s+$/, '')
    if (!typed || finished || runInFlight.current) return
    if (status === 'loading') { setFeedback({ kind: 'error', message: 'Python is still starting. One second.' }); return }
    if (status !== 'ready') return
    const token = ++submitToken.current
    runInFlight.current = true
    const program = acceptedCode ? `${acceptedCode}\n${typed}` : typed
    const outcome = await run({
      exercise: { id: `rapid-fire-${levelId}-${stepIndex}`, checks: [{ label: step.task, code: step.check }] },
      files: { 'main.py': program },
    })
    runInFlight.current = false
    if (token !== submitToken.current) return // the level changed while this rep was running
    clearTimeout(flashTimer.current)
    if (outcome?.passed) {
      const changed = Object.keys(step.data)
      setAcceptedCode(program)
      setBubbles(current => [...Object.entries(step.data), ...current.filter(([name]) => !changed.includes(name))])
      setFreshNames(changed)
      clearTimeout(freshTimer.current)
      freshTimer.current = setTimeout(() => setFreshNames([]), FRESH_HIGHLIGHT_MS)
      refocusAfterRep.current = true
      setFeedback({ kind: 'correct' })
      flashTimer.current = setTimeout(() => setFeedback(null), 350)
      if (stepIndex === steps.length - 1) {
        const endedAt = Date.now()
        // Read the clock through the ref: a pause during this run must still count.
        const finalClock = { ...resumedClock(clockRef.current, endedAt), finishedAt: endedAt }
        const finishedRun = { level: levelId, ms: elapsedMs(finalClock), misses, finishedAt: new Date(endedAt).toISOString() }
        const updatedRuns = [...runs, finishedRun].slice(-SAVED_RUN_LIMIT)
        setClock(finalClock)
        setRuns(updatedRuns)
        saveStore({ runs: updatedRuns })
      } else {
        setStepIndex(index => index + 1)
      }
    } else {
      setMisses(count => count + 1)
      setFeedback({ kind: 'error', message: readableFailure(outcome?.message, step, lineCount(acceptedCode)) })
    }
  }, [acceptedCode, finished, levelId, misses, run, runs, status, step, stepIndex, steps.length])

  useEffect(() => { clockRef.current = clock }, [clock])
  // The editor remounts per rep; refocus it after a pass so a phone keyboard stays open between reps.
  useEffect(() => {
    if (!refocusAfterRep.current) return
    refocusAfterRep.current = false
    editorRef.current?.focus()
  }, [stepIndex])

  useEffect(() => { submitRef.current = submit }, [submit])
  useEffect(() => () => { clearTimeout(flashTimer.current); clearTimeout(freshTimer.current) }, [])

  // Focus mode: no page scroll behind the window, Esc exits.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = event => { if (event.key === 'Escape') onExit() }
    window.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown, true)
    }
  }, [onExit])

  function togglePause() {
    setClock(current => current.pausedAt ? resumedClock(current) : { ...current, pausedAt: Date.now() })
  }

  function toggleClockHidden() {
    setClockHidden(hidden => {
      saveStore({ hideClock: !hidden })
      return !hidden
    })
  }

  // Multi-line reps: Enter keeps writing until the rep has as many lines as the example, then submits.
  const exampleLines = lineCount(step?.code ?? '')
  const keyBindings = useMemo(() => {
    const newLine = view => insertNewlineAndIndent(view)
    const submitTyped = view => { submitRef.current?.(view.state.doc.toString()); return true }
    return [
      { key: 'Enter', run: view => lineCount(view.state.doc.toString()) < exampleLines ? newLine(view) : submitTyped(view) },
      { key: 'Shift-Enter', run: newLine },
      { key: 'Mod-Enter', run: submitTyped },
    ]
  }, [exampleLines])

  // Typing starts the clock, and also picks it back up after a pause.
  const startClock = useCallback(() => setClock(current => current.startedAt ? resumedClock(current) : { ...current, startedAt: Date.now() }), [])

  // The editor, its status line and (on phones) symbol keys and a Submit button, so phones never depend on Enter.
  function renderTypingArea(inDrawer) {
    return <>
      {inDrawer && <SymbolKeys onInsert={text => editorRef.current?.insertText(text)} />}
      <Box sx={{
        border: `${EDITOR_BORDER}px solid`, borderColor: editorBorder, borderRadius: 2, overflow: 'hidden', transition: 'border-color 0.15s', flexShrink: 0,
        ...(inDrawer ? { flex: 1, minHeight: EDITOR_LINE_HEIGHT * 2 + 24, mx: 1 } : { height: Math.max(1, lineCount(step.code)) * EDITOR_LINE_HEIGHT + 24 }),
        animation: feedback?.kind === 'error' ? 'rapidShake 0.35s ease' : 'none',
        '@keyframes rapidShake': { '0%, 100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-6px)' }, '50%': { transform: 'translateX(6px)' }, '75%': { transform: 'translateX(-3px)' } },
      }}>
        <CodeSurface key={`${attempt}-${stepIndex}`} ref={editorRef} onChange={startClock} keyBindings={keyBindings} autoFocus
          mode="dark" ariaLabel="Type the example here" lineNumbers={false} highlightActiveLine={false} lineHeight={EDITOR_LINE_HEIGHT} paddingTop={EDITOR_PADDING_TOP} textInset={EXAMPLE_PADDING_X - EDITOR_BORDER} />
      </Box>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 2, minHeight: 24, ...(inDrawer && { px: 1.5, py: 1, flexWrap: 'wrap' }) }}>
        <Typography aria-live="polite" sx={{ fontSize: 14, color: 'error.main', fontFamily: mono }}>
          {feedback?.kind === 'error' ? feedback.message : ''}
        </Typography>
        {status === 'unavailable' && <Button size="small" onClick={restart}>Restart Python</Button>}
        <Typography sx={{ ml: 'auto', fontSize: 12, color: 'text.secondary', flexShrink: 0 }}>{status === 'loading' ? 'Starting Python...' : inDrawer ? 'Enter adds lines, then submits' : 'Enter to submit · Shift+Enter new line'}</Typography>
        {inDrawer && <Button variant="contained" onClick={() => submitRef.current?.(editorRef.current?.getValue() ?? '')}>Submit</Button>}
      </Stack>
    </>
  }

  const panel = { border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }
  const sectionLabel = { fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary', mb: 0.75 }
  const editorBorder = feedback?.kind === 'correct' ? 'success.main' : feedback?.kind === 'error' ? 'error.main' : 'divider'
  const finishedMs = finished ? elapsedMs(clock) : null
  const levelRuns = runs.filter(saved => levelOfRun(saved) === levelId)
  const isNewBest = finished && levelRuns.length > 1 && finishedMs <= bestMs
  const paused = Boolean(clock.pausedAt)

  // A big window over the dimmed site; the backdrop does not close it, only Exit or Esc.
  return <Box role="dialog" aria-modal="true" aria-label="Rapid fire practice" sx={{
    position: 'fixed', inset: 0, zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center',
    bgcolor: 'rgba(10, 12, 20, 0.6)', backdropFilter: 'blur(3px)',
    p: { xs: 1, md: 3 }, pt: { xs: 'max(8px, env(safe-area-inset-top, 0px))', md: 3 }, pb: { xs: 'max(8px, env(safe-area-inset-bottom, 0px))', md: 3 },
  }}>
    <Box sx={{
      width: '100%', maxWidth: 1100, height: { xs: '100%', md: '90vh' }, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      bgcolor: 'background.default', color: 'text.primary', borderRadius: 3, boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4)',
    }}>
      <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: { xs: 1, md: 2 }, px: { xs: 2, md: 3 }, py: 1.5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', fontWeight: 700, color: 'primary.main' }}>Rapid fire</Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{finished ? 'Done' : `${stepIndex + 1} / ${steps.length}`}</Typography>
        </Box>
        {/* On phones the levels drop below the controls as one even row of four. */}
        <ToggleButtonGroup exclusive size="small" value={levelId} onChange={(_, chosen) => chosen && startLevel(chosen)} aria-label="Choose a level" sx={{ order: { xs: 3, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
          {RAPID_FIRE_LEVELS.map(choice => {
            const best = bestOf(runs, choice.id)
            return <ToggleButton key={choice.id} value={choice.id} sx={{ flex: { xs: 1, sm: 'none' }, textTransform: 'none', lineHeight: 1.2, py: 0.5, px: { xs: 0.5, sm: 1.25 }, display: 'block', textAlign: { xs: 'center', sm: 'left' } }}>
              <Box sx={{ fontSize: 13, fontWeight: 650 }}>{choice.id === FULL_RUN_ID ? 'Full run' : `Level ${choice.id}`}</Box>
              <Box sx={{ fontSize: 11, color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>{choice.id === FULL_RUN_ID ? `${choice.steps.length} reps` : choice.title}{best !== null && ` · ${formatDuration(best)}`}</Box>
            </ToggleButton>
          })}
        </ToggleButtonGroup>
        <Stack direction="row" sx={{ ml: 'auto', alignItems: 'center', gap: 0.5 }}>
          {/* Hidden with visibility, not removed, so the header keeps its size when the clock is toggled. */}
          <Box aria-hidden={clockHidden} sx={{ textAlign: 'right', mr: 0.5, visibility: clockHidden ? 'hidden' : 'visible' }}>
            <RapidFireTimer clock={clock} />
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{paused ? 'Paused' : `Best ${bestMs === null ? '--' : formatDuration(bestMs)}`}</Typography>
          </Box>
          <Tooltip title={paused ? 'Resume clock' : 'Pause clock'}>
            <span><IconButton aria-label={paused ? 'Resume clock' : 'Pause clock'} onClick={togglePause} disabled={!clock.startedAt || finished} size="small">{paused ? <PlayArrowIcon /> : <PauseIcon />}</IconButton></span>
          </Tooltip>
          <Tooltip title={clockHidden ? 'Show clock' : 'Hide clock'}>
            <IconButton aria-label={clockHidden ? 'Show clock' : 'Hide clock'} onClick={toggleClockHidden} size="small">{clockHidden ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>
          </Tooltip>
          <Button onClick={onExit} variant="outlined" color="inherit" startIcon={<CloseIcon />} sx={{ flexShrink: 0, ml: 0.5 }}>Exit</Button>
        </Stack>
      </Stack>
      <LinearProgress aria-label="Rapid fire progress" variant="determinate" value={(finished ? steps.length : stepIndex) / steps.length * 100} sx={{ height: 4, flexShrink: 0 }} />

      <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, md: 4 }, py: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {finished ? <Box sx={{ ...panel, p: { xs: 2.5, md: 4 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{level.id === FULL_RUN_ID ? 'Full run' : `Level ${level.id} · ${level.title}`} · {isNewBest ? 'New best time' : 'Your time'}</Typography>
            <Typography sx={{ fontFamily: mono, fontSize: 44, fontWeight: 750, color: isNewBest ? 'primary.main' : 'text.primary' }}>{formatDuration(finishedMs)}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>{misses} wrong {misses === 1 ? 'try' : 'tries'} · best {formatDuration(bestMs)}</Typography>
          </Box>
          <Box>
            <Typography sx={sectionLabel}>Last runs on this level</Typography>
            {levelRuns.slice(-10).reverse().map(saved => <Stack key={saved.finishedAt} direction="row" sx={{ gap: 2, py: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography sx={{ fontFamily: mono, fontSize: 13, minWidth: 70 }}>{formatDuration(saved.ms)}</Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{saved.misses} wrong</Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', ml: 'auto' }}>{new Date(saved.finishedAt).toLocaleDateString()}</Typography>
            </Stack>)}
          </Box>
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            <Button variant="contained" onClick={() => startLevel(levelId)} autoFocus>Redo {level.id === FULL_RUN_ID ? 'full run' : 'level'}</Button>
            {nextLevel && <Button variant="outlined" onClick={() => startLevel(nextLevel.id)}>{nextLevel.id === FULL_RUN_ID ? 'Try the full run' : `Next: Level ${nextLevel.id}`}</Button>}
            <Button variant="text" onClick={onExit}>Exit</Button>
          </Stack>
        </Box> : <>
          <Box>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{step.concept} · rep {step.rep} of {step.repCount}</Typography>
            <Typography component="h2" sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 700, letterSpacing: '-0.5px', textWrap: 'balance' }}><RapidFireTask text={step.task} /></Typography>
            {step.tip && <Box sx={{ mt: 1 }}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
                <LightbulbOutlinedIcon aria-hidden="true" sx={{ fontSize: 18, color: 'warning.main' }} />
                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>Python tip</Typography>
              </Stack>
              <Box component="ul" sx={{ m: 0, mt: 0.25, pl: 4.5, color: 'text.secondary' }}>
                <Typography component="li" sx={{ fontSize: 14 }}>{step.tip}</Typography>
              </Box>
            </Box>}
          </Box>
          <Box>
            <Typography sx={sectionLabel}>Type this</Typography>
            <Box component="pre" aria-label="Example to type" sx={{ ...panel, m: 0, px: `${EXAMPLE_PADDING_X}px`, py: 1.5, fontFamily: mono, fontSize: 16, lineHeight: `${EDITOR_LINE_HEIGHT}px`, color: 'text.secondary', overflowX: 'auto', whiteSpace: 'pre' }}>{step.code}</Box>
          </Box>
          {!phone && renderTypingArea(false)}
        </>}
        <Box>
          <Typography sx={sectionLabel}>Your data</Typography>
          <RapidFireDataBank bubbles={bubbles} freshNames={freshNames} />
        </Box>
      </Box>
      {phone && !finished && <CodeDrawer title="Type here" storageKey="synlab_rapid_fire_drawer_v1" defaultShare={0.45} zIndex={2}>{renderTypingArea(true)}</CodeDrawer>}
    </Box>
  </Box>
}
