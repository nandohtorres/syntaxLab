import { useId, useLayoutEffect, useRef, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function StudyLibrary({ items, selectedId, choose, disabled = false, learningOrder = false }) {
  const core = items.filter(item => !item.optional)
  const optional = items.filter(item => item.optional)
  const instanceId = useId()
  const navRef = useRef(null)
  const selectedGroup = items.find(item => item.id === selectedId)?.group
  const groups = [...new Set(items.map(item => item.group))]
  const [expanded, setExpanded] = useState(() => items.find(item => item.id === selectedId)?.group ?? groups[0])
  useLayoutEffect(() => {
    const nav = navRef.current
    const heading = nav?.querySelector('[aria-current="true"]')?.closest('.MuiAccordion-root')?.querySelector('[aria-expanded]')
    if (heading) nav.scrollTop += heading.getBoundingClientRect().top - nav.getBoundingClientRect().top
  }, [selectedGroup])
  return <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
    <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography sx={{ fontSize: 16, fontWeight: 750, color: 'text.primary' }}>Questions <Box component="span" sx={{ float: 'right', fontSize: 11, fontWeight: 400, color: 'text.secondary' }}>{core.filter(item => item.done).length}/{core.length} practiced</Box></Typography>
      {optional.length > 0 && <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.5 }}>Optional projects: {optional.filter(item => item.done).length}/{optional.length}</Typography>}
      {learningOrder && <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.5 }}>Recommended learning order · foundations to advanced patterns</Typography>}
    </Box>
    <Box ref={navRef} component="nav" aria-label="Question patterns" tabIndex={0} sx={{ flex: 1, minHeight: 0, overflow: 'auto', scrollbarGutter: 'stable', p: 1 }}>
      {groups.map((group, index) => <Accordion key={group} expanded={expanded === group} onChange={(_, open) => setExpanded(open ? group : false)} disableGutters elevation={0} sx={{ bgcolor: 'transparent', '&:before': { display: 'none' }, borderBottom: '1px solid', borderColor: 'divider' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />} id={`${instanceId}-pattern-${index}-heading`} aria-controls={`${instanceId}-pattern-${index}-questions`} sx={{ minHeight: 42, px: 1, '& .MuiAccordionSummary-content': { my: 1 } }}>
          <Typography sx={{ fontSize: 12, fontWeight: 650, flex: 1 }}>{group}</Typography><Typography sx={{ fontSize: 11, color: 'text.secondary', mr: 1 }}>{items.filter(item => item.group === group).length}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0, pb: 1 }}>
          {items.filter(item => item.group === group).map(item => <Button className="question-item" key={item.id} fullWidth disabled={disabled} aria-current={selectedId === item.id ? 'true' : undefined} onClick={() => choose(item.id)} sx={{ justifyContent: 'flex-start', textAlign: 'left', px: 1, py: 0.75, fontSize: 12, lineHeight: 1.5, color: selectedId === item.id ? 'text.primary' : 'text.secondary', border: '1px solid', borderColor: selectedId === item.id ? 'primary.main' : 'transparent', bgcolor: selectedId === item.id ? 'action.selected' : 'transparent', borderRadius: 1.5 }}>
            <Box component="span" aria-hidden="true" sx={{ mr: 1, color: item.done ? 'primary.main' : 'text.secondary' }}>{item.done ? '\u2713' : '\u25cb'}</Box>{item.title}
          </Button>)}
        </AccordionDetails>
      </Accordion>)}
    </Box>
  </Box>
}
