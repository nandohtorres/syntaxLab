import { useState } from 'react'
import { Box, Button, Drawer, Typography } from '@mui/material'
import ListAltIcon from '@mui/icons-material/ListAlt'
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom'
import CodeDrawer from './CodeDrawer.jsx'
import DrawerTaskSummary from './DrawerTaskSummary.jsx'
import { PRACTICE_DRAWER_KEY, resetDrawer } from './codeDrawerStore.js'

// Phone layout (mobile code drawer plan): the question reads as a page, the list opens on demand,
// and code lives in a drawer the learner can size or lock. Resetting the drawer is a header control,
// so it never sits next to the editor's own "Reset code" button.
export default function PhoneStudyWorkspace({ title, library, prompt, taskSummary, editor, feedback, footer }) {
  const [listOpen, setListOpen] = useState(false)
  const surface = { border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', minWidth: 0 }
  // Picking a question closes the list so the new question is what the learner sees.
  const closeOnPick = event => { if (event.target.closest('.question-item')) setListOpen(false) }
  return <Box component="main" data-workspace-layout="phone" sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
    <Box component="header" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
      {title && <Typography component="h1" sx={{ fontSize: 22, fontWeight: 650, flex: 1 }}>{title}</Typography>}
      <Button onClick={() => resetDrawer(PRACTICE_DRAWER_KEY)} variant="text" size="small" startIcon={<VerticalAlignBottomIcon />} sx={{ ml: 'auto' }}>Reset code panel</Button>
      <Button onClick={() => setListOpen(true)} variant="outlined" size="small" startIcon={<ListAltIcon />}>Questions</Button>
    </Box>
    <Box component="section" aria-label="Exercise instructions" sx={{ ...surface, overflowWrap: 'anywhere' }}>{prompt}</Box>
    <Drawer anchor="left" open={listOpen} onClose={() => setListOpen(false)} slotProps={{ paper: { sx: { width: 'min(360px, 88vw)' } } }}>
      <Box component="section" aria-label="Full questions list" onClick={closeOnPick} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>{library}</Box>
    </Drawer>
    <CodeDrawer title="Your code" storageKey={PRACTICE_DRAWER_KEY}>
      {taskSummary && <DrawerTaskSummary key={taskSummary} text={taskSummary} />}
      {/* Grows to fill the drawer but never shrinks below the editor's own minimum, so Run / Next and the pass bar stay
          reachable; feedback then scrolls below it. */}
      <Box component="section" aria-label="Code workspace" sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>{editor}</Box>
      {feedback && <Box sx={{ flexShrink: 0, px: 1, '& > [role="status"]': { my: 1 } }}>{feedback}</Box>}
      {footer && <Box sx={{ flexShrink: 0, px: 1.5, pb: 1 }}>{footer}</Box>}
    </CodeDrawer>
  </Box>
}
