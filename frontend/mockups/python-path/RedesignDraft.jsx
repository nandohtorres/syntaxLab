import React, { useRef, useState } from 'react'
import { Alert, Box, Button, Chip, LinearProgress, Stack, Typography } from '@mui/material'
import Editor from '@monaco-editor/react'
import { definePracticeTheme, mono } from './ExerciseEditor.jsx'
import usePracticeRunner from './usePracticeRunner.js'
import exercises from './redesignExercises.js'

const border = { border: '1px solid', borderColor: 'divider', borderRadius: 2 }
const eyebrow = { fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary' }
// Short windows and mobile retain document scrolling so content stays reachable.
const desktop = '@media (min-width: 900px) and (min-height: 640px)'
const scrollbars = {
  '& *': { scrollbarWidth: 'thin', scrollbarColor: '#465e63 #101722' },
  '& ::-webkit-scrollbar': { width: 8, height: 8 },
  '& ::-webkit-scrollbar-track': { background: '#101722', borderRadius: 8 },
  '& ::-webkit-scrollbar-thumb': { background: '#465e63', borderRadius: 8, border: '2px solid #101722' },
  '& ::-webkit-scrollbar-thumb:hover': { background: '#98e7c4' },
  '& ::-webkit-scrollbar-corner': { background: '#101722' },
}
const defineDraftTheme = api => {
  definePracticeTheme(api)
  api.editor.defineTheme('synlab-draft', {
    base: 'vs-dark', inherit: true,
    rules: [{ token: 'comment', foreground: '64758c', fontStyle: 'italic' }],
    colors: {
      'editor.background': '#101722', 'editor.foreground': '#d7e3f3',
      'editorLineNumber.foreground': '#52657e', 'editorCursor.foreground': '#98e7c4',
      'scrollbarSlider.background': '#465e6380',
      'scrollbarSlider.hoverBackground': '#98e7c480',
      'scrollbarSlider.activeBackground': '#98e7c4aa',
      'scrollbar.shadow': '#00000000',
    },
  })
}

export default function RedesignDraft() {
  const [index, setIndex] = useState(0)
  const [drafts, setDrafts] = useState({})
  const [completed, setCompleted] = useState([])
  const [help, setHelp] = useState(null)
  const runner = usePracticeRunner()
  const exercise = exercises[index]
  const code = drafts[exercise.id] ?? exercise.starter
  const runRef = useRef(null)
  const running = runner.status === 'running'
  const select = next => { setIndex(next); setHelp(null); runner.clearResult() }
  const run = async () => {
    const result = await runner.run({ exercise: { ...exercise, entry: 'main.py' }, files: { 'main.py': code } })
    if (result?.passed) setCompleted(previous => [...new Set([...previous, exercise.id])])
  }
  runRef.current = run
  const groups = [...new Set(exercises.map(item => item.group))]

  return <Box sx={{ ...scrollbars, minHeight: '100dvh', p: { xs: 1.5, md: 3 }, background: 'radial-gradient(ellipse at 15% 0%, #152a2b 0%, #0c111b 48%)', [desktop]: { height: '100dvh', display: 'flex', alignItems: 'center', overflow: 'hidden' } }}>
    <Box component="main" sx={{ width: '100%', maxWidth: 1560, mx: 'auto', [desktop]: { height: '100%', maxHeight: 1080, minHeight: 0, display: 'flex', flexDirection: 'column', p: 2.5, border: '1px solid #253042', borderRadius: 3, bgcolor: '#0e1520', boxShadow: '0 24px 80px #00000040' } }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 2.5, flexWrap: 'wrap', flexShrink: 0, [desktop]: { mb: 1.5 } }}>
        <Box sx={{ width: 35, height: 35, ...border, display: 'grid', placeItems: 'center', bgcolor: '#98e7c410', color: 'primary.main', fontFamily: mono, fontWeight: 700 }}>{'{ }'}</Box>
        <Typography sx={{ fontSize: 23, fontWeight: 750, letterSpacing: '-0.7px' }}>Syntax<span style={{ color: '#98e7c4' }}>Lab</span></Typography>
        <Chip size="small" label="Design draft" variant="outlined" sx={{ color: 'text.secondary', fontSize: 11 }} />
        <Typography sx={{ ml: 'auto', color: 'text.secondary', fontSize: 12, display: { xs: 'none', sm: 'block' } }}>A little practice. A little more fluent.</Typography>
      </Stack>

      <Box component="nav" aria-label="Study sections" sx={{ display: 'flex', gap: 1, borderBottom: '1px solid', borderColor: 'divider', mb: 2.5, overflowX: 'auto', flexShrink: 0, [desktop]: { mb: 1.5 } }}>
        <Button aria-current="page" sx={{ px: 2, py: 1.4, borderBottom: '2px solid', borderRadius: 0, whiteSpace: 'nowrap' }}>Syntax practice</Button>
        <Button component="a" href="./#python" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>Python Path ↗</Button>
        <Button component="a" href="./#interview" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>Interview prep ↗</Button>
      </Box>

      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2.5, flexShrink: 0, [desktop]: { mb: 2 } }}>
        <Box><Typography sx={{ ...eyebrow, color: 'primary.main', mb: 0.6 }}>Your practice workspace</Typography><Typography component="h1" sx={{ fontSize: { xs: 23, md: 30 }, fontWeight: 650, letterSpacing: '-0.7px' }}>Build fluency, one rep at a time.</Typography></Box>
        <Box sx={{ minWidth: 100, textAlign: 'right' }}><Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 1 }}>{completed.length} / {exercises.length} samples passed</Typography><LinearProgress variant="determinate" value={completed.length / exercises.length * 100} sx={{ height: 4, borderRadius: 3, bgcolor: '#253042' }} /></Box>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(310px, 0.8fr) minmax(0, 1.2fr)' }, gap: 2, alignItems: 'stretch', [desktop]: { flex: 1, minHeight: 0, gridTemplateRows: 'minmax(0, 1fr)' } }}>
        <Stack spacing={2} sx={{ minWidth: 0, [desktop]: { minHeight: 0 } }}>
          <Box component="section" aria-label="Practice exercises" sx={{ ...border, bgcolor: '#111925', overflow: 'hidden', [desktop]: { flex: '0 0 36%', minHeight: 120, display: 'flex', flexDirection: 'column' } }}>
            <Stack direction="row" sx={{ px: 2.5, py: 1.5, justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}><Typography sx={eyebrow}>Exercise library</Typography><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>6 sample reps</Typography></Stack>
            <Box tabIndex={0} aria-label="Scroll exercise library" sx={{ maxHeight: { xs: 185, md: 225 }, overflowY: 'auto', p: 1, [desktop]: { flex: 1, minHeight: 0, maxHeight: 'none' } }}>
              {groups.map(group => <Box key={group}><Typography sx={{ ...eyebrow, fontSize: 9, px: 1.5, pt: 1.5, pb: 0.7 }}>{group}</Typography>{exercises.map((item, position) => item.group === group && <Button key={item.id} disabled={running} onClick={() => select(position)} aria-pressed={position === index} fullWidth sx={{ justifyContent: 'flex-start', gap: 1.5, textAlign: 'left', px: 1.5, py: 1, mb: 0.3, color: position === index ? 'primary.main' : 'text.secondary', bgcolor: position === index ? '#98e7c410' : 'transparent', border: '1px solid', borderColor: position === index ? '#98e7c430' : 'transparent', fontSize: 13 }}><Box component="span" sx={{ width: 18, fontFamily: mono, color: completed.includes(item.id) ? 'primary.main' : '#607188' }}>{completed.includes(item.id) ? '✓' : String(position + 1).padStart(2, '0')}</Box>{item.title}</Button>)}</Box>)}
            </Box>
          </Box>

          <Box component="section" tabIndex={0} aria-labelledby="exercise-title" sx={{ ...border, p: { xs: 2, md: 2.5 }, bgcolor: '#111925', flex: 1, [desktop]: { minHeight: 0, overflowY: 'auto' } }}>
            <Typography sx={{ ...eyebrow, color: 'primary.main', mb: 1 }}>Rep {String(index + 1).padStart(2, '0')} · {exercise.group}</Typography>
            <Typography id="exercise-title" component="h2" sx={{ fontSize: 23, fontWeight: 650, letterSpacing: '-0.4px', mb: 1.5 }}>{exercise.title}</Typography>
            <Typography sx={{ fontSize: 14, lineHeight: 1.8, color: '#bdc9da' }}>{exercise.prompt}</Typography>
            <Box sx={{ mt: 2.5, mb: 2, p: 1.5, bgcolor: '#0c131e', borderRadius: 1.5, borderLeft: '2px solid #98e7c4' }}><Typography sx={{ ...eyebrow, mb: 0.8 }}>Target result</Typography><Typography sx={{ fontFamily: mono, fontSize: 12, overflowWrap: 'anywhere', color: '#d7e3f3' }}>{exercise.expected}</Typography></Box>
            <Stack direction="row" spacing={1}><Button size="small" variant="outlined" onClick={() => setHelp(help === 'hint' ? null : 'hint')}>Hint</Button><Button size="small" sx={{ color: 'text.secondary' }} onClick={() => setHelp(help === 'answer' ? null : 'answer')}>View solution</Button></Stack>
            {help && <Box sx={{ mt: 2, p: 1.5, ...border, bgcolor: '#0c131e' }}><Typography sx={{ ...eyebrow, mb: 1 }}>{help === 'hint' ? 'A small nudge' : 'Worked solution'}</Typography>{help === 'hint' ? <Typography sx={{ fontSize: 13, lineHeight: 1.7 }}>{exercise.hint}</Typography> : <Box component="pre" sx={{ m: 0, fontFamily: mono, fontSize: 12, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{exercise.starter + exercise.answer}</Box>}</Box>}
            <Box aria-live="polite" sx={{ mt: 2 }}>{runner.result && <Alert severity={runner.result.passed ? 'success' : 'warning'} sx={{ alignItems: 'flex-start', fontSize: 13 }}><strong>{runner.result.title}</strong><Box sx={{ mt: 0.5 }}>{runner.result.message}</Box>{runner.result.output && <Box component="pre" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontFamily: mono }}>{runner.result.output}</Box>}</Alert>}</Box>
          </Box>
        </Stack>

        <Box component="section" aria-label="Code workspace" sx={{ ...border, bgcolor: '#101722', overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0, '& > .MuiStack-root': { flexShrink: 0 }, [desktop]: { minHeight: 0 } }}>
          <Stack direction="row" sx={{ alignItems: 'center', px: 2.5, py: 1.6, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#151e2b' }}><Typography sx={{ fontFamily: mono, fontSize: 13 }}><span style={{ color: '#98e7c4', marginRight: 12 }}>py</span>main.py</Typography><Typography sx={{ ml: 'auto', color: 'text.secondary', fontSize: 11 }}>Python · browser runner</Typography></Stack>
          <Box sx={{ height: { xs: 350, md: 470 }, flex: { md: 1 }, minHeight: { md: 400 }, [desktop]: { height: 'auto', flex: 1, minHeight: 0 } }}>
            <Editor height="100%" path={`redesign/${exercise.id}/main.py`} language="python" theme="synlab-draft" beforeMount={defineDraftTheme} value={code} onChange={value => { setDrafts(previous => ({ ...previous, [exercise.id]: value ?? '' })); runner.clearResult() }} onMount={(editor, api) => editor.addCommand(api.KeyMod.CtrlCmd | api.KeyCode.Enter, () => runRef.current())} options={{ ariaLabel: 'Draft Python code editor', fontFamily: mono, fontSize: 16, lineHeight: 28, minimap: { enabled: false }, padding: { top: 24 }, scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8, useShadows: false }, scrollBeyondLastLine: false, automaticLayout: true, tabSize: 4, occurrencesHighlight: 'off', readOnly: running, wordWrap: 'on', quickSuggestions: false, wordBasedSuggestions: 'off', suggestOnTriggerCharacters: false }} />
          </Box>
          <Stack direction="row" sx={{ px: 2, py: 1, borderTop: '1px solid', borderColor: 'divider', gap: 1, alignItems: 'center' }}><Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: runner.status === 'ready' ? 'primary.main' : '#b6a477' }} /><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{runner.status === 'ready' ? 'Ready to run' : runner.status === 'loading' ? 'Starting Python…' : running ? 'Running…' : 'Runner unavailable'}</Typography><Typography sx={{ ml: 'auto', fontSize: 11, color: 'text.secondary' }}>Code stays in your browser</Typography></Stack>
          <Stack direction="row" sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}><Button disabled={running} sx={{ color: 'text.secondary' }} onClick={() => { setDrafts(previous => ({ ...previous, [exercise.id]: exercise.starter })); runner.clearResult(); setHelp(null) }}>Reset code</Button><Typography sx={{ ml: 'auto', fontSize: 11, color: 'text.secondary', display: { xs: 'none', lg: 'block' } }}>Ctrl / ⌘ + Enter</Typography><Box sx={{ ml: { xs: 'auto', lg: 0 } }} />{runner.status === 'unavailable' ? <Button variant="outlined" onClick={runner.restart}>Retry Python</Button> : running ? <Button variant="outlined" onClick={runner.stop}>Stop</Button> : <Button variant="contained" disabled={runner.status !== 'ready'} onClick={run}>▶ Run code</Button>}{runner.result?.passed && index < exercises.length - 1 && <Button variant="outlined" onClick={() => select(index + 1)}>Next rep →</Button>}</Stack>
        </Box>
      </Box>
      <Typography sx={{ textAlign: 'center', fontSize: 11, color: 'text.secondary', mt: 2, flexShrink: 0, [desktop]: { mt: 1.5 } }}>Layout & interaction draft · sample exercises · progress lasts for this visit only</Typography>
    </Box>
  </Box>
}
