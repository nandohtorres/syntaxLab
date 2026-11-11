import { Box, Stack } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { mono } from './editorSupport.js'

// Styled like Rapid Fire's data bubbles: label, value, then its type in small capitals.
function ValueBubble({ label, value, tone }) {
  return <Box sx={theme => ({
    display: 'inline-flex', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 0.75, px: 1.25, py: 0.4, borderRadius: 2.5, minWidth: 0,
    overflowWrap: 'anywhere', bgcolor: alpha(theme.palette[tone].main, theme.palette.mode === 'dark' ? 0.16 : 0.11),
  })}>
    <Box component="span" sx={{ fontSize: 13, color: 'text.secondary' }}>{label}</Box>
    <Box component="span" sx={{ fontFamily: mono, fontSize: 14, fontWeight: 700 }}>{value.text}</Box>
    <Box component="span" sx={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.secondary' }}>{value.type}</Box>
  </Box>
}

// What the check expected next to what the learner's code produced, side by side.
export default function ValueComparison({ expected, got }) {
  return <Stack direction="row" role="group" aria-label="Expected compared with your result" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
    <ValueBubble label="Expected:" value={expected} tone="primary" />
    <Box component="span" aria-hidden="true" sx={{ color: 'text.secondary' }}>│</Box>
    <ValueBubble label="You wrote:" value={got} tone="warning" />
  </Stack>
}
