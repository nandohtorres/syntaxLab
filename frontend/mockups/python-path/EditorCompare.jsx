import React, { useState } from 'react'
import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import Editor from '@monaco-editor/react'
import './editorRuntime.js'
import CodeSurface from './CodeSurface.jsx'
import { definePracticeTheme, mono } from './editorSupport.js'

// Review page for ADR 0001 stage 2: the owner compares both editors before desktop switches.
const SAMPLE = `# Best time to buy and sell a stock
def max_profit(prices: list[int]) -> int:
    lowest = prices[0]
    best = 0
    for price in prices:
        lowest = min(lowest, price)
        best = max(best, price - lowest)
    return best

print(max_profit([7, 1, 5, 3, 6, 4]))  # 5
is_done = True
`

function Pane({ label, children }) {
  return <Box sx={{ flex: 1, minWidth: 0 }}>
    <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>{label}</Typography>
    <Box sx={{ height: 330, border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>{children}</Box>
  </Box>
}

function Row({ mode }) {
  const [monacoCode, setMonacoCode] = useState(SAMPLE)
  const [surfaceCode, setSurfaceCode] = useState(SAMPLE)
  return <Box>
    <Stack direction={{ xs: 'column', md: 'row' }} sx={{ gap: 2 }}>
      <Pane label="Now: Monaco">
        <Editor height="100%" language="python" value={monacoCode} onChange={value => setMonacoCode(value ?? '')}
          theme={mode === 'light' ? 'synlab-practice-light' : 'synlab-practice'} beforeMount={definePracticeTheme}
          options={{ fontFamily: mono, fontSize: 16, lineHeight: 27, minimap: { enabled: false }, tabSize: 4, occurrencesHighlight: 'off', scrollBeyondLastLine: false, padding: { top: 15 }, quickSuggestions: false, automaticLayout: true }} />
      </Pane>
      <Pane label="New: CodeMirror (CodeSurface)">
        <CodeSurface value={surfaceCode} onChange={setSurfaceCode} mode={mode} />
      </Pane>
    </Stack>
  </Box>
}

// Monaco has one global theme per page, so the review shows one mode at a time.
export default function EditorCompare() {
  const [mode, setMode] = useState('dark')
  return <Stack sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 }, gap: 3 }}>
    <Box>
      <Typography component="h1" sx={{ fontSize: 24, fontWeight: 750 }}>Editor comparison</Typography>
      <Typography sx={{ color: 'text.secondary' }}>Same code, same size. Type in both: Enter after a colon, Tab, brackets, quotes.</Typography>
    </Box>
    <ToggleButtonGroup exclusive size="small" value={mode} onChange={(_, chosen) => chosen && setMode(chosen)} aria-label="Editor theme">
      <ToggleButton value="dark">Dark editor</ToggleButton>
      <ToggleButton value="light">Light editor</ToggleButton>
    </ToggleButtonGroup>
    <Row key={mode} mode={mode} />
  </Stack>
}
