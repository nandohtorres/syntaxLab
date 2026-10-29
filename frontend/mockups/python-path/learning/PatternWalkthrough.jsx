import { Box, Chip, Stack, Typography } from '@mui/material'
import { patternWalkthroughs } from './patternWalkthroughs.js'

export default function PatternWalkthrough({ unit }) {
  const example = patternWalkthroughs[unit]
  return <Box component="section" aria-label="Worked pattern example" sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
    <Typography component="h4" sx={{ fontSize: 18, fontWeight: 700 }}>Follow it step by step</Typography>
    <Typography sx={{ mt: 0.75, mb: 2, fontSize: 14 }}>{example.goal}</Typography>
    <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5 }}>
      {example.steps.map((step, index) => <Box component="li" key={step.title} sx={{ minWidth: 0, p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
          <Box sx={{ borderRadius: '50%', width: 26, height: 26, flexShrink: 0, display: 'grid', placeItems: 'center', bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: 12, fontWeight: 700 }}>{index + 1}</Box>
          <Typography component="h5" sx={{ fontSize: 14, fontWeight: 700 }}>{step.title}</Typography>
        </Stack>
        <Stack direction="row" sx={{ my: 1.5, gap: 0.75, flexWrap: 'wrap' }}>
          {step.values.map((value, cell) => <Chip key={cell} label={value} variant="outlined" color={step.active.includes(cell) ? 'primary' : 'default'} sx={{ height: 'auto', minHeight: 32, maxWidth: '100%', borderRadius: 1.5, bgcolor: 'background.paper', '& .MuiChip-label': { p: 0.75, whiteSpace: 'normal', overflowWrap: 'anywhere', fontFamily: 'Consolas, monospace', fontSize: 12 } }} />)}
        </Stack>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.8 }}>{step.note}</Typography>
      </Box>)}
    </Box>
    <Typography sx={{ mt: 2, pl: 1.5, borderLeft: '3px solid', borderColor: 'primary.main', fontSize: 13, lineHeight: 1.8 }}><strong>What to remember: </strong>{example.takeaway}</Typography>
  </Box>
}
