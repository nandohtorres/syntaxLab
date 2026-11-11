import React, { useMemo, useRef, useState } from 'react'
import { Box, Button, CircularProgress, IconButton, ListSubheader, Menu, MenuItem, Stack, Tab, Tabs, ThemeProvider, Tooltip, Typography, useMediaQuery } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import RefreshIcon from '@mui/icons-material/Refresh'
import CodeSurface from './CodeSurface.jsx'
import { mono, download } from './editorSupport.js'
import practiceTheme, { lightPracticeTheme } from './practiceTheme.js'
import { exerciseFileTools } from './exerciseFeatures.js'
import { useEditorTheme } from './editorThemeStore.js'
import { useInCodeDrawer, useStudyLayout } from './layoutContext.js'
import { useFirstTryStreak } from './streakStore.js'
import { REDUCED_MOTION_FADE_MS, launchCharacters, launchVibration } from './codeLaunch.js'
import SymbolKeys from './SymbolKeys.jsx'

const EDITOR_THEME_CHOICES = [
  { value: null, label: 'Match site theme' },
  { value: 'light', label: 'Light editor' },
  { value: 'dark', label: 'Dark editor' },
]
const RUN_SHORTCUT = /Mac|iPhone|iPad/.test(globalThis.navigator?.platform ?? '') ? '⌘+Enter to run' : 'Ctrl+Enter to run'
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

export default function ExerciseEditor({ exercise, files, active, setActive, change, addFile, reset, status, run, stop, passed, passResult, compact = false, next, skip, skipLabel = 'Skip question', nextLabel = 'Next question' }) {
  const layout = useStudyLayout()
  const [editorMode, editorThemeChoice, setEditorThemeChoice] = useEditorTheme()
  const streak = useFirstTryStreak()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const tools = exerciseFileTools(exercise)
  const island = layout === 'island'
  // Inside the phone code drawer the editor fills the drawer and gains a symbol row.
  const inDrawer = useInCodeDrawer()
  const demo = layout !== 'current'
  const desktop = '@media (min-width: 900px) and (min-height: 760px)'
  const runAction = useRef(run)
  const nextAction = useRef(null)
  const editor = useRef(null)
  const nextButton = useRef(null)
  const mounted = useRef(false)
  const [optionsAnchor, setOptionsAnchor] = useState(null)
  // Holds the exercise id being launched, so moving on early (Next, Ctrl+Shift+Enter) never hides the new code.
  const [launchingId, setLaunchingId] = useState(null)
  const launching = launchingId === exercise.id
  const launchReady = passed && status === 'ready' && !!next
  React.useEffect(() => { runAction.current = run }, [run])
  React.useEffect(() => { nextAction.current = launchReady ? next : null }, [launchReady, next])
  React.useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
  // A pass moves focus to Next, so Enter (or Space) continues; the pass bar never covers the code.
  React.useEffect(() => { if (launchReady) nextButton.current?.focus({ preventScroll: true }) }, [launchReady])
  const keyBindings = useMemo(() => [
    { key: 'Mod-Enter', run: () => { runAction.current(); return true } },
    { key: 'Mod-Shift-Enter', run: () => { nextAction.current?.(); return true } },
  ], [])

  // "Tap your code to launch it": after a pass, a tap or click on the editor explodes the code, then advances.
  async function launchCode() {
    if (!launchReady || launching) return
    const launchedId = exercise.id
    const pieces = editor.current?.characterBoxes()
    setLaunchingId(launchedId)
    launchVibration()
    if (reducedMotion || !pieces?.boxes.length) await wait(REDUCED_MOTION_FADE_MS)
    else await launchCharacters(pieces)
    if (!mounted.current) return
    setLaunchingId(current => current === launchedId ? null : current)
    nextAction.current?.()
  }

  const passedChecks = passResult?.checks?.filter(check => check.passed).length ?? 0
  const totalChecks = passResult?.checks?.length ?? 0
  return <ThemeProvider theme={editorMode === 'light' ? lightPracticeTheme : practiceTheme}><Box sx={{ border: '1px solid', borderColor: passed ? 'primary.main' : 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.default', ...(island && { [desktop]: { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 } }), ...(inDrawer && { display: 'flex', flexDirection: 'column', flex: '1 0 auto', border: 0, borderRadius: 0 }) }}>
    <Stack direction="row" sx={{ bgcolor: 'background.paper', alignItems: 'center', flexWrap: 'wrap' }}>
      <Tabs value={active} onChange={(_, name) => setActive(name)} variant="scrollable" scrollButtons="auto" aria-label="Workspace files" sx={{ flex: 1, minWidth: 140 }}>
        {Object.keys(files).map(name => <Tab key={name} value={name} label={name} sx={{ fontFamily: mono, textTransform: 'none', fontSize: 13 }} />)}
      </Tabs>
      {(tools.add || tools.save) && <Box component="details" sx={{ position: 'relative', mr: 1 }}><Typography component="summary" sx={{ cursor: 'pointer', fontSize: 13, color: 'primary.main' }}>File tools</Typography><Stack sx={{ position: 'absolute', right: 0, zIndex: 3, minWidth: 130, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', p: 1 }}>{tools.add && <Button size="small" onClick={addFile} disabled={status === 'running'}>+ File</Button>}{tools.save && <Button size="small" onClick={() => download(active, files[active])}>Save file</Button>}</Stack></Box>}
      <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, mr: 0.5 }}>
        <Tooltip title="Reset code"><IconButton size="small" aria-label="Reset code" onClick={reset} disabled={status === 'running'} ><RefreshIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Editor options"><IconButton size="small" aria-label="Editor options" aria-haspopup="menu" aria-expanded={Boolean(optionsAnchor)} onClick={event => setOptionsAnchor(event.currentTarget)} sx={{ mx: 0.5 }}><MoreHorizIcon fontSize="small" /></IconButton></Tooltip>
        <Menu anchorEl={optionsAnchor} open={Boolean(optionsAnchor)} onClose={() => setOptionsAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <ListSubheader sx={{ lineHeight: 2.5, fontSize: 13 }}>Editor theme</ListSubheader>
          {EDITOR_THEME_CHOICES.map(choice => <MenuItem key={choice.label} role="menuitemradio" aria-checked={editorThemeChoice === choice.value} onClick={() => { setEditorThemeChoice(choice.value); setOptionsAnchor(null) }} sx={{ fontSize: 14, gap: 1 }}>
            <CheckIcon aria-hidden="true" fontSize="small" sx={{ visibility: editorThemeChoice === choice.value ? 'visible' : 'hidden' }} />{choice.label}
          </MenuItem>)}
        </Menu>
      </Box>
    </Stack>
    {inDrawer && <SymbolKeys onInsert={text => editor.current?.insertText(text)} />}
    <Box onClick={launchReady ? launchCode : undefined} sx={{ position: 'relative', height: demo ? { xs: 260, md: 280 } : compact ? { xs: 180, sm: 220 } : { xs: 320, sm: 380 }, ...(island && { [desktop]: { height: 'auto', flex: 1, minHeight: 100 } }), ...(inDrawer && { height: 'auto', flex: 1, minHeight: 120 }), ...(launchReady && { cursor: 'pointer' }), opacity: launching ? 0 : 1, transition: launching && reducedMotion ? `opacity ${REDUCED_MOTION_FADE_MS}ms ease` : 'none' }}>
      {/* Keyed per file so each file keeps its own editor, like Monaco's per-path models. */}
      <CodeSurface key={`${exercise.id}/${active}`} ref={editor} value={files[active] ?? ''} onChange={change}
        language={active.endsWith('.py') ? 'python' : 'plaintext'} mode={editorMode} readOnly={status === 'running'}
        keyBindings={keyBindings} autoFocus />
    </Box>
    <Stack direction="row" sx={{ p: 1.5, alignItems: 'center', columnGap: 1, rowGap: 1, flexWrap: 'wrap', borderTop: '1px solid', borderColor: 'divider', ...(passed && { bgcolor: 'action.hover' }) }}>
      {passed ? <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'primary.main' }}><span aria-hidden="true">✓ </span>Passed · {passedChecks}/{totalChecks} checks</Typography>
        <Typography sx={{ fontSize: 13, lineHeight: 1.5, color: 'text.secondary' }}>{passResult?.message}{launchReady && ' Tap your code to launch it.'}</Typography>
      </Box> : <Box sx={{ flex: 1 }} />}
      {streak > 0 && <Typography title="First-try passes in a row" sx={{ fontSize: 13, fontWeight: 650, whiteSpace: 'nowrap', color: 'text.secondary' }}><span aria-hidden="true">🔥 </span>{streak} streak</Typography>}
      {!passed && !inDrawer && finePointer && status === 'ready' && <Typography sx={{ fontSize: 13, color: 'text.secondary', whiteSpace: 'nowrap' }}>{RUN_SHORTCUT}</Typography>}
      {status === 'running' ? <Button onClick={stop} variant="outlined">Stop</Button> : <Button onClick={run} variant={passed ? 'outlined' : 'contained'} disabled={status !== 'ready'} startIcon={status === 'loading' ? <CircularProgress size={14} /> : null}>{status === 'loading' ? 'Loading Python' : 'Run code'}</Button>}
      {(skip || compact || demo) && <Button ref={nextButton} disabled={status === 'running' || (!skip && (!passed || status !== 'ready'))} variant={passed ? 'contained' : 'text'} onClick={passed ? next : skip} title={passed ? undefined : 'Move on without earning credit'}>{passed ? nextLabel : skipLabel} →</Button>}
    </Stack>
  </Box></ThemeProvider>
}
