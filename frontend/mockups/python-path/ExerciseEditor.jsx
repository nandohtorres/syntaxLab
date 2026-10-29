import React, { useRef } from 'react'
import { Box, Button, CircularProgress, IconButton, Stack, Tab, Tabs, ThemeProvider, Tooltip, Typography } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import RefreshIcon from '@mui/icons-material/Refresh'
import Editor from '@monaco-editor/react'
import './editorRuntime.js'

import { mono, definePracticeTheme, download } from './editorSupport.js'
import practiceTheme, { lightPracticeTheme } from './practiceTheme.js'
import { exerciseFileTools } from './exerciseFeatures.js'
import { useEditorTheme } from './editorThemeStore.js'
import { useStudyLayout } from './layoutContext.js'
import PassCelebration from './PassCelebration.jsx'

export default function ExerciseEditor({ exercise, files, active, setActive, change, addFile, reset, status, run, stop, passed, compact = false, next, skip, skipLabel = 'Skip question', nextLabel = 'Next question' }) {
  const layout = useStudyLayout()
  const [editorMode, toggleEditorMode] = useEditorTheme()
  const tools = exerciseFileTools(exercise)
  const island = layout === 'island'
  const demo = layout !== 'current'
  const desktop = '@media (min-width: 900px) and (min-height: 760px)'
  const runAction = useRef(run)
  const nextAction = useRef(null)
  const editor = useRef(null)
  React.useEffect(() => { runAction.current = run }, [run])
  React.useEffect(() => { nextAction.current = passed && status === 'ready' ? next : null }, [passed, status, next])
  return <ThemeProvider theme={editorMode === 'light' ? lightPracticeTheme : practiceTheme}><Box sx={{ border: '1px solid', borderColor: passed ? 'primary.main' : 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.default', ...(island && { [desktop]: { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 } }) }}>
    <Stack direction="row" sx={{ bgcolor: 'background.paper', alignItems: 'center', flexWrap: 'wrap' }}>
      <Tabs value={active} onChange={(_, name) => setActive(name)} variant="scrollable" scrollButtons="auto" aria-label="Workspace files" sx={{ flex: 1, minWidth: 140 }}>
        {Object.keys(files).map(name => <Tab key={name} value={name} label={name} sx={{ fontFamily: mono, textTransform: 'none', fontSize: 12 }} />)}
      </Tabs>
      {(tools.add || tools.save) && <Box component="details" sx={{ position: 'relative', mr: 1 }}><Typography component="summary" sx={{ cursor: 'pointer', fontSize: 12, color: 'primary.main' }}>File tools</Typography><Stack sx={{ position: 'absolute', right: 0, zIndex: 3, minWidth: 130, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', p: 1 }}>{tools.add && <Button size="small" onClick={addFile} disabled={status === 'running'}>+ File</Button>}{tools.save && <Button size="small" onClick={() => download(active, files[active])}>Save file</Button>}</Stack></Box>}
      <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, mr: 0.5 }}>
      <Tooltip title="Reset code"><IconButton size="small" aria-label="Reset code" onClick={reset} disabled={status === 'running'} ><RefreshIcon fontSize="small" /></IconButton></Tooltip>
      <Tooltip title={`Use ${editorMode === 'light' ? 'dark' : 'light'} editor`}><IconButton size="small" onClick={toggleEditorMode} aria-label={`Use ${editorMode === 'light' ? 'dark' : 'light'} editor`} sx={{ mx: 0.5 }}>{editorMode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}</IconButton></Tooltip>
      </Box>
    </Stack>
    <Box sx={{ position: 'relative', height: demo ? { xs: 260, md: 280 } : compact ? { xs: 180, sm: 220 } : { xs: 320, sm: 380 }, ...(island && { [desktop]: { height: 'auto', flex: 1, minHeight: 100 } }) }}>
      <Editor height="100%" path={`${exercise.id}/${active}`} value={files[active] ?? ''}
        language={active.endsWith('.py') ? 'python' : active.endsWith('.json') ? 'json' : 'plaintext'}
        onChange={value => change(value ?? '')} theme={editorMode === 'light' ? 'synlab-practice-light' : 'synlab-practice'}
        beforeMount={definePracticeTheme}
        onMount={(instance, api) => { editor.current = instance; instance.addCommand(api.KeyMod.CtrlCmd | api.KeyCode.Enter, () => runAction.current()); instance.addCommand(api.KeyMod.CtrlCmd | api.KeyMod.Shift | api.KeyCode.Enter, () => nextAction.current?.()); instance.focus() }}
        options={{ ariaLabel: 'Python code editor', fontFamily: mono, fontSize: 16, lineHeight: 27, minimap: { enabled: false }, scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8, useShadows: false }, tabSize: 4, automaticLayout: true, occurrencesHighlight: 'off', scrollBeyondLastLine: false, padding: { top: 15 }, quickSuggestions: false, suggestOnTriggerCharacters: false, wordBasedSuggestions: 'off', readOnly: status === 'running' }} />
      {passed && status === 'ready' && next && <PassCelebration key={exercise.id} onNext={next} onReturn={() => editor.current?.focus()} />}
    </Box>
    <Stack direction="row" spacing={1} sx={{ p: 1.5, alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ flex: 1 }} />
      {status === 'running' ? <Button onClick={stop} variant="outlined">Stop</Button> : <Button onClick={run} variant={passed ? 'outlined' : 'contained'} disabled={status !== 'ready'} startIcon={status === 'loading' ? <CircularProgress size={14} /> : null}>{status === 'loading' ? 'Loading Python' : 'Run code'}</Button>}
      {(skip || compact || demo) && <Button disabled={status === 'running' || (!skip && (!passed || status !== 'ready'))} variant={passed ? 'contained' : 'text'} onClick={passed ? next : skip} title={passed ? undefined : 'Move on without earning credit'}>{passed ? nextLabel : skipLabel} →</Button>}
    </Stack>
  </Box></ThemeProvider>
}
