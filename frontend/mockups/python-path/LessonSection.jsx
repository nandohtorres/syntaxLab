import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

export default function LessonSection({ title, icon: Icon, tone = 'primary', children }) {
  return <Box component="section" aria-label={title} sx={theme => ({ mt: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderLeft: `3px solid ${theme.palette[tone].main}`, borderRadius: 2, bgcolor: alpha(theme.palette[tone].main, theme.palette.mode === 'dark' ? 0.06 : 0.025) })}>
    <Typography component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 14, fontWeight: 750, mb: 1 }}>{Icon && <Icon sx={{ fontSize: 18, color: `${tone}.main` }} />}{title}</Typography>
    {children}
  </Box>
}
