import React, { useEffect, useRef, useState } from 'react'
import {
  Box, Button, Chip, CircularProgress, Collapse, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, IconButton, Stack, Tooltip, Typography,
} from '@mui/material'
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import CodeRoundedIcon from '@mui/icons-material/CodeRounded'
import StopRoundedIcon from '@mui/icons-material/StopRounded'
import Editor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker'
import usePracticeRunner from './usePracticeRunner.js'

globalThis.MonacoEnvironment = { getWorker: () => new EditorWorker() }
loader.config({ monaco })

const mono = '"Cascadia Code", "Cascadia Mono", Consolas, monospace'
const initialCode = '# Write your Python here\n'
const path = ['Variables & values', 'Strings & expressions', 'Conditions & loops', 'Functions & methods', 'Files & small scripts', 'Blind 75 building blocks']

export default function PracticePreview() {
  const [code, setCode] = useState(initialCode)
  const [hint, setHint] = useState(false)
  const [solution, setSolution] = useState(false)
  const [complete, setComplete] = useState(false)
  const editor = useRef(null)
  const runAction = useRef(null)
  const { status, result, run, stop, restart, clearResult } = usePracticeRunner()
  const passed = result?.passed === true
  useEffect(() => {
    runAction.current = () => run(editor.current?.getValue() ?? code)
  }, [code, run])

  function changeCode(value) {
    setCode(value ?? '')
    clearResult()
  }

  function reset() {
    if (status === 'running') stop()
    setCode(initialCode)
    setHint(false)
    setSolution(false)
    clearResult()
    setComplete(false)
    editor.current?.focus()
  }

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <Box component="header" sx={{ height: 78, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 2.5, md: 5 } }}>
        <Stack direction="row" alignItems="center" spacing={1.4}>
          <Box sx={{ bgcolor: '#98e7c414', border: '1px solid #98e7c430', color: 'primary.main', borderRadius: 2, display: 'grid', placeItems: 'center', width: 36, height: 36 }}>
            <TerminalRoundedIcon fontSize="small" />
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 750, letterSpacing: '-0.7px' }}>SyntaxLab</Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: '12px !important', my: '8px !important', display: { xs: 'none', sm: 'block' } }} />
          <Typography sx={{ fontSize: 13, color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>Python Path</Typography>
        </Stack>
        <Chip label="First-exercise preview" size="small" variant="outlined" sx={{ color: 'text.secondary', borderColor: 'divider', fontSize: 11, height: 27 }} />
      </Box>

      <Box sx={{ display: 'flex', maxWidth: 1560, mx: 'auto' }}>
        <Box component="aside" aria-label="Learning path" sx={{ width: 254, flexShrink: 0, minHeight: 'calc(100dvh - 78px)', borderRight: '1px solid', borderColor: 'divider', px: 3, py: 4, display: { xs: 'none', lg: 'flex' }, flexDirection: 'column' }}>
          <Typography sx={{ fontSize: 10, letterSpacing: 2, fontWeight: 700, color: 'text.secondary', mb: 1.3 }}>YOUR WORKSPACE</Typography>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
            <CodeRoundedIcon sx={{ fontSize: 19, color: 'primary.main' }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Daily practice</Typography>
            <Box sx={{ width: 5, height: 5, bgcolor: 'primary.main', borderRadius: '50%', ml: 'auto !important' }} />
          </Stack>
          <Typography sx={{ fontSize: 10, letterSpacing: 2, fontWeight: 700, color: 'text.secondary', mb: 2 }}>THE PATH AHEAD</Typography>
          <Stack spacing={0.8}>
            {path.map((label, index) => (
              <Box key={label} aria-current={index === 0 ? 'step' : undefined} sx={{ display: 'flex', alignItems: 'center', gap: 1.3, py: 1.3, px: 1.4, mx: -1.4, bgcolor: index === 0 ? '#98e7c40a' : 'transparent', borderRadius: 1.5, border: '1px solid', borderColor: index === 0 ? '#98e7c425' : 'transparent' }}>
                <Typography sx={{ fontFamily: mono, fontSize: 11, color: index === 0 ? 'primary.main' : '#536176' }}>{String(index + 1).padStart(2, '0')}</Typography>
                <Typography sx={{ fontSize: 12, color: index === 0 ? '#c7e8d9' : 'text.secondary', fontWeight: index === 0 ? 600 : 400 }}>{label}</Typography>
              </Box>
            ))}
          </Stack>
          <Box sx={{ mt: 'auto', pt: 7 }}>
            <Box sx={{ width: 27, height: 2, bgcolor: 'primary.main', mb: 1.8, opacity: 0.5 }} />
            <Typography sx={{ fontSize: 13, lineHeight: 1.8, color: 'text.secondary' }}>A little code.<br />Another rep.<br />More confidence.</Typography>
          </Box>
        </Box>

        <Box component="main" sx={{ flex: 1, minWidth: 0, p: { xs: 2.3, sm: 4, md: 5 }, pb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ color: 'text.secondary', mb: 3.5 }}>
            <Typography sx={{ fontSize: 11, letterSpacing: 1.1 }}>FOUNDATIONS</Typography>
            <ChevronRightRoundedIcon sx={{ fontSize: 14 }} />
            <Typography sx={{ fontSize: 11, letterSpacing: 1.1, color: '#c5d0df' }}>VARIABLES</Typography>
            <Typography sx={{ ml: 'auto !important', fontFamily: mono, fontSize: 11, color: 'text.secondary' }}>REP 01</Typography>
          </Stack>

          <Typography component="h1" sx={{ fontSize: { xs: 29, sm: 37 }, fontWeight: 650, lineHeight: 1.25, letterSpacing: '-1.3px', mb: 1 }}>Give a value a name.</Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 3.2 }}>Your first line of Python. Keep it simple.</Typography>

          <Box sx={{ bgcolor: '#141e2c', border: '1px solid #2a384c', borderRadius: 2, py: 2.2, px: 2.5, mb: 2.8, display: 'flex', alignItems: 'flex-start', gap: 1.8 }}>
            <Box sx={{ width: 25, height: 25, display: 'grid', placeItems: 'center', bgcolor: '#98e7c414', color: 'primary.main', borderRadius: 1, flexShrink: 0, mt: 0.1 }}><TerminalRoundedIcon sx={{ fontSize: 16 }} /></Box>
            <Box>
              <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.8, color: 'primary.main', mb: 0.8 }}>YOUR TASK</Typography>
              <Typography sx={{ fontSize: { xs: 14, sm: 16 }, lineHeight: 1.8 }}>Create a variable named <Box component="code" sx={{ fontFamily: mono, color: '#c3d6ff', bgcolor: '#21304a', borderRadius: 0.5, px: 0.7, py: 0.15 }}>retries</Box> and set it to the integer <Box component="code" sx={{ fontFamily: mono, color: '#f1d49c' }}>3</Box>.</Typography>
            </Box>
          </Box>

          <Box sx={{ overflow: 'hidden', border: '1px solid', borderColor: passed ? '#98e7c475' : '#2c394b', borderRadius: 2.2, bgcolor: '#101722', transition: 'border-color 180ms' }}>
            <Stack direction="row" alignItems="center" sx={{ height: 46, bgcolor: '#151e2b', borderBottom: '1px solid', borderColor: 'divider', px: 2 }}>
              <Box sx={{ width: 7, height: 7, bgcolor: '#81b8ef', borderRadius: 0.5, mr: 1 }} />
              <Typography sx={{ fontFamily: mono, fontSize: 12 }}>main.py</Typography>
              <Typography sx={{ ml: 'auto', color: 'text.secondary', fontSize: 11 }}>Python</Typography>
              <Tooltip title="Reset your code"><span><IconButton aria-label="Reset code" onClick={reset} disabled={status === 'running'} size="small" sx={{ ml: 1.3, color: 'text.secondary' }}><RestartAltRoundedIcon sx={{ fontSize: 18 }} /></IconButton></span></Tooltip>
            </Stack>
            <Box sx={{ height: { xs: 245, sm: 284 }, pt: 1.2, bgcolor: '#101722' }}>
              <Editor
                height="100%"
                language="python"
                path="first-rep.py"
                value={code}
                theme="synlab-practice"
                onChange={changeCode}
                loading={<Typography sx={{ p: 3, color: 'text.secondary', fontSize: 13 }}>Opening your editor…</Typography>}
                beforeMount={api => api.editor.defineTheme('synlab-practice', {
                  base: 'vs-dark', inherit: true,
                  rules: [{ token: 'comment', foreground: '64758c', fontStyle: 'italic' }, { token: 'number', foreground: 'F1D49C' }],
                  colors: { 'editor.background': '#101722', 'editor.foreground': '#d7e3f3', 'editorLineNumber.foreground': '#46566b', 'editorLineNumber.activeForeground': '#9aadbf', 'editor.lineHighlightBackground': '#151e2a', 'editorCursor.foreground': '#98e7c4', 'editor.selectionBackground': '#29495b' },
                })}
                onMount={(instance, api) => {
                  editor.current = instance
                  instance.setPosition({ lineNumber: 2, column: 1 })
                  instance.addCommand(api.KeyMod.CtrlCmd | api.KeyCode.Enter, () => runAction.current?.())
                  instance.focus()
                }}
                options={{ ariaLabel: 'Python code editor', fontFamily: mono, fontSize: 18, lineHeight: 32, minimap: { enabled: false }, scrollBeyondLastLine: false, lineNumbersMinChars: 3, padding: { top: 8 }, tabSize: 4, automaticLayout: true, folding: false, glyphMargin: false, renderLineHighlight: 'line', overviewRulerLanes: 0, hideCursorInOverviewRuler: true, scrollbar: { vertical: 'auto', horizontal: 'auto', verticalScrollbarSize: 6 }, suggestOnTriggerCharacters: false, quickSuggestions: false, wordBasedSuggestions: 'off', readOnly: status === 'running' }}
              />
            </Box>
            <Stack direction="row" alignItems="center" sx={{ minHeight: 66, bgcolor: '#121c29', borderTop: '1px solid', borderColor: 'divider', px: { xs: 1.5, sm: 2.3 }, gap: 1 }}>
              <Button size="small" startIcon={<LightbulbOutlinedIcon sx={{ fontSize: '17px !important' }} />} onClick={() => setHint(value => !value)} aria-expanded={hint} sx={{ color: 'text.secondary', fontSize: 12 }}>Need a hint?</Button>
              <Box sx={{ flex: 1 }} />
              <Typography sx={{ fontSize: 10, color: '#718199', fontFamily: mono, mr: 0.8, display: { xs: 'none', sm: 'block' } }}>Ctrl / ⌘ + Enter</Typography>
              {status === 'running' ? (
                <Button variant="outlined" size="small" startIcon={<StopRoundedIcon />} onClick={stop}>Stop</Button>
              ) : (
                <Button variant="contained" startIcon={status === 'loading' ? <CircularProgress size={14} color="inherit" /> : <PlayArrowRoundedIcon />} disabled={status !== 'ready'} onClick={() => runAction.current?.()} sx={{ minWidth: 112, px: 2.2, py: 0.8 }}>{status === 'loading' ? 'Loading…' : 'Run code'}</Button>
              )}
            </Stack>
          </Box>

          <Collapse in={hint}>
            <Box sx={{ mt: 1.5, py: 1.6, px: 2, border: '1px solid #35432c', borderRadius: 1.5, bgcolor: '#b6c88708' }}>
              <Typography sx={{ fontSize: 13, color: '#c8d2ba', lineHeight: 1.8 }}>Put the variable name on the left, one equals sign in the middle, and its value on the right. Numbers don’t need quotes.</Typography>
              <Button size="small" onClick={() => setSolution(value => !value)} sx={{ fontSize: 11, color: '#a8b995', mt: 0.4 }}>{solution ? 'Hide example' : 'Show this rep’s solution'}</Button>
              {solution && <Typography component="pre" sx={{ fontFamily: mono, fontSize: 14, mt: 1, mb: 0, color: 'primary.main' }}>retries = 3</Typography>}
            </Box>
          </Collapse>

          <Box aria-live="polite" role="status" sx={{ mt: 2, minHeight: 126 }}>
            {result ? (
              <Box sx={{ p: 2.2, borderRadius: 2, border: '1px solid', borderColor: passed ? '#98e7c43d' : '#e8ba7938', bgcolor: passed ? '#98e7c408' : '#e8ba7907' }}>
                <Stack direction="row" spacing={1.3} alignItems="flex-start">
                  <Box sx={{ mt: '2px !important', color: passed ? 'primary.main' : '#e8ba79', fontFamily: mono }}>{passed ? <CheckRoundedIcon sx={{ fontSize: 21 }} /> : '↳'}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 650, mb: 0.5, color: passed ? '#c7f2df' : '#f0d4b0' }}>{result.title}</Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.8 }}>{result.message}</Typography>
                    {result.output && <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontFamily: mono, fontSize: 12, color: '#b9c6d7', mb: 0 }}>Output: {result.output}</Typography>}
                    {result.checks?.length > 0 && <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mt: 1.4 }}>{result.checks.map(check => <Typography key={check.label} sx={{ fontSize: 10, color: check.passed ? '#98e7c4' : '#c49f7a' }}>{check.passed ? '✓' : '○'} {check.label}</Typography>)}</Stack>}
                  </Box>
                </Stack>
              </Box>
            ) : (
              <Box sx={{ px: 0.4, py: 1.2 }}>
                <Typography sx={{ fontSize: 12, color: '#8290a4', mb: 0.6 }}>Write it. Run it. See what happens.</Typography>
                <Typography sx={{ fontSize: 11, color: '#596b81' }}>Feedback appears here. You can try as many times as you like.</Typography>
              </Box>
            )}
          </Box>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 1.8, borderTop: '1px solid', borderColor: 'divider', gap: 2 }}>
            <Stack direction="row" alignItems="center" spacing={0.9}>
              <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: status === 'ready' || status === 'running' ? 'primary.main' : status === 'unavailable' ? '#e8ba79' : '#5e6b7c' }} />
              <Typography sx={{ color: 'text.secondary', fontSize: 10 }}>{status === 'loading' ? 'Preparing Python…' : status === 'unavailable' ? 'Python couldn’t load' : status === 'running' ? 'Running your code…' : 'Python ready'}</Typography>
              {status === 'unavailable' && <Button size="small" onClick={restart} sx={{ fontSize: 11 }}>Retry loading</Button>}
            </Stack>
            <Button variant={passed ? 'contained' : 'text'} disabled={!passed} onClick={() => setComplete(true)} endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: '16px !important' }} />} sx={{ fontSize: 12, px: 2 }}>Next rep</Button>
          </Stack>
        </Box>
      </Box>

      <Dialog open={complete} onClose={() => setComplete(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { p: 1, bgcolor: '#151e2b', border: '1px solid #344d43' } }}>
        <DialogTitle sx={{ fontWeight: 650, letterSpacing: '-0.5px' }}>One line. First rep done.</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 14, lineHeight: 1.9, color: 'text.secondary' }}>That’s the loop: a small task, real code, quick feedback, then another rep.</Typography>
          <Typography sx={{ fontSize: 13, lineHeight: 1.9, mt: 2 }}>This preview ends here. The next exercise would ask you to change the value of an existing variable.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setComplete(false)} sx={{ color: 'text.secondary' }}>Back to my code</Button>
          <Button variant="contained" onClick={reset}>Try again from blank</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
