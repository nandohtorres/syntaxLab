import { Box } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { codeChip } from './editorSupport.js'

// Only text that is certainly code becomes a chip: calls like add(a, b), snake_case or dotted names,
// and Python's True/False/None. Plain words stay prose, even when they double as variable names.
const CODE = /([A-Za-z_][\w.]*\([^()\n]*\)|\b[A-Za-z]\w*(?:_\w+|\.\w+)+\b|\b(?:True|False|None)\b)/

export default function TaskText({ text }) {
  // split() with one capture group alternates prose (even indexes) and code (odd indexes).
  return text.split(CODE).map((part, index) => index % 2 === 0
    ? part
    : <Box key={index} component="code" sx={theme => ({ ...codeChip, fontWeight: 650, color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.1) })}>{part}</Box>)
}
