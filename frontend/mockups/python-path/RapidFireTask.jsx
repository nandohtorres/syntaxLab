import { Box } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { mono } from './editorSupport.js'

// Tasks mark code with backticks (`info`, `n * 2`); quoted text ("Dallas") becomes a string chip.
// Code chips take the variable-name green so names read as code at a glance, not as English words.
const SEGMENT = /(`[^`]+`|"[^"]*")/g

const chip = { fontFamily: mono, fontSize: '0.88em', px: 0.6, py: 0.1, borderRadius: 1, whiteSpace: 'pre-wrap' }

export default function RapidFireTask({ text }) {
  return text.split(SEGMENT).filter(Boolean).map((part, index) => {
    if (part.startsWith('`')) {
      return <Box key={index} component="code" sx={theme => ({ ...chip, fontWeight: 700, color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.12) })}>{part.slice(1, -1)}</Box>
    }
    if (part.startsWith('"')) {
      return <Box key={index} component="code" sx={{ ...chip, fontWeight: 600, bgcolor: 'action.hover' }}>{part}</Box>
    }
    return part
  })
}
