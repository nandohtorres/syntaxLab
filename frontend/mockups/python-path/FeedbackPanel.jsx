import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { download, mono } from './editorSupport.js'
import ValueComparison from './ValueComparison.jsx'

// Failed checks need 4.5:1 contrast in both themes: a dark amber on light, the theme's warning tone on dark.
const failedTone = theme => theme.palette.mode === 'dark' ? theme.palette.warning.main : '#8a4b08'
// These messages only restate the expected/got values, which the comparison bubbles already show.
const RESTATES_VALUES = /; got /
// Screen readers hear "passed" or "failed" instead of the decorative check marks.
const visuallyHiddenSx = { position: 'absolute', width: '1px', height: '1px', p: 0, m: '-1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }

export default function FeedbackPanel({ result, watchFor }) {
  if (!result) return null
  const checks = result.checks ?? []
  // The first failed check is the root cause: later checks often fail only because of it.
  const rootCause = result.passed ? null : checks.find(check => !check.passed)
  const showRootMessage = rootCause?.message && !(rootCause.expected && RESTATES_VALUES.test(rootCause.message))
  return <Box role="status" aria-live="polite" sx={{ my: 2, p: 2, border: '1px solid', borderColor: result.passed ? '#98e7c43d' : 'divider', borderRadius: 2, overflowWrap: 'anywhere' }}>
    {rootCause ? <>
      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{result.title}</Typography>
      <Typography sx={{ fontSize: 15, fontWeight: 700, color: failedTone, mt: 0.25 }}><span aria-hidden="true">✕ </span>{rootCause.label}</Typography>
      {showRootMessage && <Typography sx={{ fontSize: 14, mt: 0.5 }}>{rootCause.message}</Typography>}
      {rootCause.expected && <ValueComparison expected={rootCause.expected} got={rootCause.got} />}
    </> : <>
      <Typography sx={{ fontWeight: 650, color: result.passed ? 'primary.main' : 'text.primary' }}>{result.title}</Typography>
      {/* After a pass the reflection line lives in the editor's pass bar. */}
      {!result.passed && <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.6 }}>{result.message}</Typography>}
    </>}
    {!result.passed && watchFor && <Typography sx={{ mt: 1, fontSize: 14, lineHeight: 1.6 }}><strong>Watch for: </strong>{watchFor}</Typography>}
    {result.output && <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: mono, fontSize: 13 }}>{result.output}</Typography>}
    {checks.length > 1 && <Stack spacing={0.5} sx={{ mt: 1 }}>{checks.map((check, index) => <Typography key={index} sx={{ fontSize: 13, color: check.passed ? 'primary.main' : failedTone }}>
      <span aria-hidden="true">{check.passed ? '✓' : '✕'} </span>{check.label}<Box component="span" sx={visuallyHiddenSx}>{check.passed ? ' passed' : ' failed'}</Box>
    </Typography>)}</Stack>}
    {Object.entries(result.generatedFiles ?? {}).map(([name, text]) => <Box key={name} sx={{ mt: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1}><Typography sx={{ fontSize: 13 }}>Generated: {name} (read only)</Typography><Button size="small" onClick={() => download(name, text)}>Save output</Button></Stack>
      <Typography component="pre" sx={{ fontSize: 13, fontFamily: mono, whiteSpace: 'pre-wrap', maxHeight: 220, overflow: 'auto' }}>{text}</Typography>
    </Box>)}
  </Box>
}
