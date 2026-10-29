import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { partLayouts } from './partLayouts.js'

export default function PartLayoutPreview({ value, change, disabled }) {
  return <Box sx={{ mb: 1.5, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
    <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Compare part navigation</Typography>
    <ToggleButtonGroup exclusive size="small" value={value} disabled={disabled} onChange={(_, next) => { if (next) change(next) }} aria-label="Part navigation demos" sx={{ flexWrap: 'wrap' }}>
      {partLayouts.map(item => <ToggleButton key={item.id} value={item.id} sx={{ fontSize: 11, px: 1 }}>{item.label}</ToggleButton>)}
    </ToggleButtonGroup>
  </Box>
}
