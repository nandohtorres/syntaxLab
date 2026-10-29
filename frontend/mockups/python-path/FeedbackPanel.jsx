import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { download, mono } from './editorSupport.js'

export default function FeedbackPanel({ result }) {
  if (!result) return null
  return <Box role="status" aria-live="polite" sx={{ my: 2, p: 2, border: '1px solid', borderColor: result?.passed ? '#98e7c43d' : 'divider', borderRadius: 2, overflowWrap: 'anywhere' }}>
    <Typography sx={{ fontWeight: 650, color: result?.passed ? 'primary.main' : 'text.primary' }}>{result?.title ?? 'Write it. Run it. See what happens.'}</Typography>
    <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.6 }}>{result?.message ?? 'Try as many times as you need. Each run starts in a fresh file workspace.'}</Typography>
    {result?.output && <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: mono, fontSize: 12 }}>{result.output}</Typography>}
    <Stack spacing={0.5} sx={{ mt: 1 }}>{result?.checks?.map((check, index) => <Typography key={index} sx={{ fontSize: 12, color: check.passed ? 'primary.main' : '#edbd84' }}>{check.passed ? '✓' : '○'} {check.label}</Typography>)}</Stack>
    {Object.entries(result?.generatedFiles ?? {}).map(([name, text]) => <Box key={name} sx={{ mt: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1}><Typography sx={{ fontSize: 12 }}>Generated: {name} (read only)</Typography><Button size="small" onClick={() => download(name, text)}>Save output</Button></Stack>
      <Typography component="pre" sx={{ fontSize: 12, fontFamily: mono, whiteSpace: 'pre-wrap', maxHeight: 220, overflow: 'auto' }}>{text}</Typography>
    </Box>)}
  </Box>
}
