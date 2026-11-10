import React, { useMemo, useRef } from 'react'
import { Box, Button, CircularProgress, IconButton, Stack, Tab, Tabs, ThemeProvider, Tooltip, Typography } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import RefreshIcon from '@mui/icons-material/Refresh'
import CodeSurface from './CodeSurface.jsx'
import { mono, download } from './editorSupport.js'
import practiceTheme, { lightPracticeTheme } from './practiceTheme.js'
import { exerciseFileTools } from './exerciseFeatures.js'
import { useEditorTheme } from './editorThemeStore.js'
import { useInCodeDrawer, useStudyLayout } from './layoutContext.js'
import SymbolKeys from './SymbolKeys.jsx'
import PassCelebration from './PassCelebration.jsx'

export default function ExerciseEditor({ exercise, files, active, setActive, change, addFile, reset, status, run, stop, passed, compact = false, next, skip, skipLabel = 'Skip question', nextLabel = 'Next question' }) {
  const layout = useStudyLayout()
  const [editorMode, toggleEditorMode] = useEditorTheme()
  const tools = exerciseFileTools(exercise)
  const island = layout === 'island'
  // Inside the phone code drawer the editor fills the drawer and gains a symbol row.
  const inDrawer = useInCodeDrawer()
  const demo = layout !== 'current'
  const desktop = '@media (min-width: 900px) and (min-height: 760px)'
  const runAction = useRef(run)
  const nextAction = useRef(null)
  const editor = useRef(null)
  React.useEffect(() => { runAction.current = run }, [run])
  React.useEffect(() => { nextAction.current = passed && status === 'ready' ? next : null }, [passed, status, next])
  const keyBindings = useMemo(() => [
    { key: 'Mod-Enter', run: () => { runAction.current(); return true } },
    { key: 'Mod-Shift-Enter', run: () => { nextAction.current?.(); return true } },
  ], [])
  return <ThemeProvider theme={editorMode === 'light' ? lightPracticeTheme : practiceTheme}><Box sx={{ border: '1px solid', borderColor: passed ? 'primary.main' : 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.default', ...(island && { [desktop]: { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 } }), ...(inDrawer && { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, border: 0, borderRadius: 0 }) }}>
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
    {inDrawer && <SymbolKeys onInsert={text => editor.current?.insertText(text)} />}
    <Box sx={{ position: 'relative', height: demo ? { xs: 260, md: 280 } : compact ? { xs: 180, sm: 220 } : { xs: 320, sm: 380 }, ...(island && { [desktop]: { height: 'auto', flex: 1, minHeight: 100 } }), ...(inDrawer && { height: 'auto', flex: 1, minHeight: 120 }) }}>
      {/* Keyed per file so each file keeps its own editor, like Monaco's per-path models. */}
      <CodeSurface key={`${exercise.id}/${active}`} ref={editor} value={files[active] ?? ''} onChange={change}
        language={active.endsWith('.py') ? 'python' : 'plaintext'} mode={editorMode} readOnly={status === 'running'}
        keyBindings={keyBindings} autoFocus />
      {passed && status === 'ready' && next && <PassCelebration key={exercise.id} onNext={next} onReturn={() => editor.current?.focus()} />}
    </Box>
    <Stack direction="row" spacing={1} sx={{ p: 1.5, alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ flex: 1 }} />
      {status === 'running' ? <Button onClick={stop} variant="outlined">Stop</Button> : <Button onClick={run} variant={passed ? 'outlined' : 'contained'} disabled={status !== 'ready'} startIcon={status === 'loading' ? <CircularProgress size={14} /> : null}>{status === 'loading' ? 'Loading Python' : 'Run code'}</Button>}
      {(skip || compact || demo) && <Button disabled={status === 'running' || (!skip && (!passed || status !== 'ready'))} variant={passed ? 'contained' : 'text'} onClick={passed ? next : skip} title={passed ? undefined : 'Move on without earning credit'}>{passed ? nextLabel : skipLabel} →</Button>}
    </Stack>
  </Box></ThemeProvider>
}
