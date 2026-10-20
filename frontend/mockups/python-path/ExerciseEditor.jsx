import React, { useRef } from 'react'
import { Box, Button, CircularProgress, Stack, Tab, Tabs, Typography } from '@mui/material'
import Editor from '@monaco-editor/react'
import './editorRuntime.js'

export const mono = '"Cascadia Code", Consolas, monospace'
export const definePracticeTheme = api => api.editor.defineTheme('synlab-practice', { base: 'vs-dark', inherit: true, rules: [{ token: 'comment', foreground: '64758c', fontStyle: 'italic' }], colors: { 'editor.background': '#101722', 'editor.foreground': '#d7e3f3', 'editorLineNumber.foreground': '#52657e', 'editorCursor.foreground': '#98e7c4' } })

export function download(name, text, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = name.split('/').pop()
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function ExerciseEditor({ exercise, files, active, setActive, change, addFile, reset, status, run, stop, hint, passed }) {
  const runAction = useRef(run)
  React.useEffect(() => { runAction.current = run }, [run])
  return <Box sx={{ border: '1px solid', borderColor: passed ? '#98e7c475' : '#2c394b', borderRadius: 2, overflow: 'hidden', bgcolor: '#101722' }}>
    <Stack direction="row" sx={{ bgcolor: '#151e2b', alignItems: 'center', flexWrap: 'wrap' }}>
      <Tabs value={active} onChange={(_, name) => setActive(name)} variant="scrollable" scrollButtons="auto" aria-label="Workspace files" sx={{ flex: 1, minWidth: 140 }}>
        {Object.keys(files).map(name => <Tab key={name} value={name} label={name} sx={{ fontFamily: mono, textTransform: 'none', fontSize: 12 }} />)}
      </Tabs>
      <Button size="small" onClick={addFile} disabled={status === 'running'}>+ File</Button>
      <Button size="small" onClick={() => download(active, files[active])}>Save file</Button>
      <Button size="small" onClick={reset} disabled={status === 'running'}>Reset code</Button>
    </Stack>
    <Box sx={{ height: { xs: 320, sm: 380 } }}>
      <Editor height="100%" path={`${exercise.id}/${active}`} value={files[active] ?? ''}
        language={active.endsWith('.py') ? 'python' : active.endsWith('.json') ? 'json' : 'plaintext'}
        onChange={value => change(value ?? '')} theme="synlab-practice"
        beforeMount={definePracticeTheme}
        onMount={(instance, api) => { instance.addCommand(api.KeyMod.CtrlCmd | api.KeyCode.Enter, () => runAction.current()); instance.focus() }}
        options={{ ariaLabel: 'Python code editor', fontFamily: mono, fontSize: 16, lineHeight: 27, minimap: { enabled: false }, tabSize: 4, automaticLayout: true, occurrencesHighlight: 'off', scrollBeyondLastLine: false, padding: { top: 15 }, quickSuggestions: false, suggestOnTriggerCharacters: false, wordBasedSuggestions: 'off', readOnly: status === 'running' }} />
    </Box>
    <Stack direction="row" spacing={1} sx={{ p: 1.5, alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
      <Button onClick={hint} size="small" sx={{ color: 'text.secondary' }}>Need a hint?</Button>
      <Typography sx={{ flex: 1, fontSize: 11, color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>Ctrl/Cmd + Enter</Typography>
      <Box sx={{ flex: { xs: 1, sm: 0 } }} />
      {status === 'running' ? <Button onClick={stop} variant="outlined">Stop</Button> : <Button onClick={run} variant="contained" disabled={status !== 'ready'} startIcon={status === 'loading' ? <CircularProgress size={14} /> : null}>{status === 'loading' ? 'Loading Python' : 'Run code'}</Button>}
    </Stack>
  </Box>
}
