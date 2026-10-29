import { Box, Typography } from '@mui/material'
import { useStudyLayout } from './layoutContext.js'

const desktop = '@media (min-width: 900px) and (min-height: 760px)'

export default function StudyWorkspace({ title, library, prompt, editor, feedback, footer, libraryFraction = 40 }) {
  const island = useStudyLayout() === 'island'
  const surface = { border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', minWidth: 0 }
  return <Box component="main" data-workspace-layout={island ? 'island' : 'flow'} sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', ...(island && { [desktop]: { flex: 1, minHeight: 0 } }) }}>
    {title && <Box component="header" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1.5, flexShrink: 0 }}>
      <Typography component="h1" sx={{ fontSize: 26, fontWeight: 650, flex: 1 }}>{title}</Typography>
    </Box>}
    <Box sx={{ display: 'grid', minWidth: 0, gap: 2, gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: island ? 'minmax(290px, 0.42fr) minmax(0, 0.58fr)' : '240px minmax(0, 1fr)' }, gridTemplateAreas: { xs: '"prompt" "editor" "library"', md: island ? '"prompt editor" "library editor"' : '"library prompt" "library editor"' }, ...(island && { [desktop]: { flex: 1, minHeight: 0, gridTemplateRows: `minmax(0, ${100 - libraryFraction}fr) minmax(0, ${libraryFraction}fr)` } }) }}>
      <Box component="section" aria-label="Exercise instructions" sx={{ ...surface, gridArea: 'prompt', overflowWrap: 'anywhere', ...(island ? { [desktop]: { minHeight: 0, overflow: 'auto', scrollbarGutter: 'stable' } } : { border: 0, bgcolor: 'transparent' }) }}>{prompt}</Box>
      <Box component="section" aria-label="Full questions list" sx={{ ...surface, gridArea: 'library', height: { xs: 330, md: island ? 360 : 650 }, overflow: 'hidden', display: 'flex', flexDirection: 'column', ...(island && { [desktop]: { minHeight: 0, height: 'auto' } }) }}>{library}</Box>
      <Box sx={{ gridArea: 'editor', display: 'flex', flexDirection: 'column', minWidth: 0, gap: 1.5, ...(island && { [desktop]: { minHeight: 0 } }) }}>
        <Box component="section" aria-label="Code workspace" sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', ...(island && { [desktop]: { flex: 1, minHeight: 0 } }) }}>{editor}</Box>
        {feedback && <Box sx={{ flexShrink: 0, '& > [role="status"]': { my: 0 }, ...(island && { [desktop]: { maxHeight: 150, overflow: 'auto', scrollbarGutter: 'stable' } }) }}>{feedback}</Box>}
        {footer && <Box sx={{ flexShrink: 0, ...(island && { [desktop]: { maxHeight: 90, overflow: 'auto' } }) }}>{footer}</Box>}
      </Box>
    </Box>
  </Box>
}
