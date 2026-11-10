import { useState } from 'react'
import { Box, Button, Drawer, Typography } from '@mui/material'
import ListAltIcon from '@mui/icons-material/ListAlt'
import CodeDrawer from './CodeDrawer.jsx'

// Phone layout (mobile code drawer plan): the question reads as a page, the list opens on demand,
// and code lives in a drawer the learner can size, lock or reset.
export default function PhoneStudyWorkspace({ title, library, prompt, editor, feedback, footer }) {
  const [listOpen, setListOpen] = useState(false)
  const surface = { border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', minWidth: 0 }
  // Picking a question closes the list so the new question is what the learner sees.
  const closeOnPick = event => { if (event.target.closest('.question-item')) setListOpen(false) }
  return <Box component="main" data-workspace-layout="phone" sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
    <Box component="header" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {title && <Typography component="h1" sx={{ fontSize: 22, fontWeight: 650, flex: 1 }}>{title}</Typography>}
      <Button onClick={() => setListOpen(true)} variant="outlined" size="small" startIcon={<ListAltIcon />} sx={{ ml: 'auto' }}>Questions</Button>
    </Box>
    <Box component="section" aria-label="Exercise instructions" sx={{ ...surface, overflowWrap: 'anywhere' }}>{prompt}</Box>
    <Drawer anchor="left" open={listOpen} onClose={() => setListOpen(false)} slotProps={{ paper: { sx: { width: 'min(360px, 88vw)' } } }}>
      <Box component="section" aria-label="Full questions list" onClick={closeOnPick} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>{library}</Box>
    </Drawer>
    <CodeDrawer title="Your code" storageKey="synlab_code_drawer_v1">
      <Box component="section" aria-label="Code workspace" sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>{editor}</Box>
      {feedback && <Box sx={{ flexShrink: 0, px: 1, '& > [role="status"]': { my: 1 } }}>{feedback}</Box>}
      {footer && <Box sx={{ flexShrink: 0, px: 1.5, pb: 1 }}>{footer}</Box>}
    </CodeDrawer>
  </Box>
}
