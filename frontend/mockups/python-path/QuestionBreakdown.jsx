import { useId, useLayoutEffect, useRef, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Collapse, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import OriginalProblem from './OriginalProblem.jsx'

export default function QuestionBreakdown({ exercise, lessons, choose, disabled, layout = 'outline', pattern = 'Sliding Window', heading, groupId = exercise.problemId, kind = 'problem', children }) {
  const instanceId = useId()
  const [open, setOpen] = useState(false)
  const navRef = useRef(null)
  const triggerRef = useRef(null)
  const previous = useRef({ id: exercise.id, groupId })
  const index = lessons.findIndex(item => item.id === exercise.id)
  useLayoutEffect(() => {
    const panel = navRef.current?.closest('[aria-label="Exercise instructions"]')
    if (panel && previous.current.id !== exercise.id) {
      if (previous.current.groupId !== groupId) panel.scrollTop = 0
      else {
        const anchor = navRef.current.closest('[aria-label="Your task"]') ?? navRef.current
        panel.scrollTop += anchor.getBoundingClientRect().top - panel.getBoundingClientRect().top - 12
      }
    }
    previous.current = { id: exercise.id, groupId }
  }, [exercise.id, groupId])
  function selectPart(item) {
    setOpen(false)
    choose(item)
    triggerRef.current?.focus({ preventScroll: true })
  }
  const header = <Box sx={{ mb: 1.5 }}>
    {pattern && <Typography sx={{ fontSize: 21, fontWeight: 800, color: 'primary.main', mb: 0.75 }}>{pattern}</Typography>}
    <Typography component="h1" sx={{ fontSize: { xs: 21, md: 23 }, fontWeight: 650, lineHeight: 1.4 }}>{heading ?? `${exercise.problemId}. ${exercise.questionTitle ?? exercise.title}`}</Typography>
    {exercise.url && !exercise.originalProblem && <Typography component="a" href={exercise.url} target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-block', fontSize: 11, color: 'text.secondary', mt: 0.5 }}>View on LeetCode &#8599;</Typography>}
    <OriginalProblem problem={exercise.originalProblem} />
  </Box>
  const renderContent = selector => typeof children === 'function' ? children(selector) : <>{selector}{children}</>
  if (!lessons.length) return <>{header}{renderContent()}</>
  if (layout === 'accordion') return <>{header}<Box ref={navRef} component="nav" aria-label="Question parts" data-parts-layout="accordion">
    {lessons.map((item, itemIndex) => <Accordion key={item.id} disableGutters elevation={0} expanded={exercise.id === item.id} disabled={disabled} onChange={(_, open) => { if (open) choose(item) }} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px !important', mb: 1, '&::before': { display: 'none' } }}>
      <AccordionSummary id={`${instanceId}-${itemIndex}-title`} aria-controls={`${instanceId}-${itemIndex}-body`} expandIcon={<ExpandMoreIcon fontSize="small" />} sx={{ px: 1.5 }}><Typography sx={{ fontSize: 13, fontWeight: exercise.id === item.id ? 750 : 500 }}>{item.title}</Typography></AccordionSummary>
      <AccordionDetails sx={{ p: 1, pt: 0 }}>{exercise.id === item.id && <><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Part {itemIndex + 1} of {lessons.length}</Typography>{renderContent()}</>}</AccordionDetails>
    </Accordion>)}
  </Box></>
  const selector = <Box ref={navRef} component="nav" aria-label="Question parts" data-parts-layout={layout} onKeyDown={event => { if (event.key === 'Escape' && open) { setOpen(false); triggerRef.current?.focus({ preventScroll: true }) } }}>
    {layout === 'guided' ? <Box sx={{ p: 1.25, bgcolor: 'action.hover', borderRadius: 2 }}>
      <TextField select fullWidth size="small" label="Choose a part" value={exercise.id} disabled={disabled} onChange={event => choose(lessons.find(item => item.id === event.target.value))}>
        {lessons.map(item => <MenuItem key={item.id} value={item.id} sx={{ fontSize: 13, whiteSpace: 'normal' }}>{item.title}</MenuItem>)}
      </TextField>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 0.75 }}>
        <IconButton size="small" aria-label="Previous part" disabled={disabled || index <= 0} onClick={() => choose(lessons[index - 1])}><ArrowBackIcon fontSize="small" /></IconButton>
        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Part {index + 1} of {lessons.length}</Typography>
        <IconButton size="small" aria-label="Next part" disabled={disabled || index >= lessons.length - 1} onClick={() => choose(lessons[index + 1])}><ArrowForwardIcon fontSize="small" /></IconButton>
      </Stack>
    </Box> : <Box>
      <Typography sx={{ fontSize: 15, fontWeight: 750, color: 'text.primary', px: 1, pt: 0.75, mb: 0.5 }}>{kind === 'topic' ? `This topic has ${lessons.length} practice ${lessons.length === 1 ? 'part' : 'parts'}` : `This problem is broken into ${lessons.length} smaller ${lessons.length === 1 ? 'step' : 'steps'}`}</Typography>
      <Typography sx={{ fontSize: 12, lineHeight: 1.6, color: 'text.secondary', px: 1, mb: 1 }}>{kind === 'topic' ? 'Choose a part to practice this topic.' : 'Choose a step to work toward the full solution.'}</Typography>
      <Button ref={triggerRef} fullWidth disabled={disabled} aria-expanded={open} aria-controls={`${instanceId}-parts`} onClick={() => setOpen(value => !value)} sx={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: 12, px: 1, py: 0.75, color: 'primary.main', bgcolor: 'action.selected', borderRadius: 1 }}>
        <Box component="span" sx={{ flexShrink: 0, width: 23, height: 23, borderRadius: '50%', display: 'grid', placeItems: 'center', border: '1px solid', borderColor: 'primary.main', mr: 1 }}>{exercise.stepLetter ?? index + 1}</Box>
        {exercise.title.replace(/^[a-z]+\.\s*/i, '')}<ExpandMoreIcon fontSize="small" sx={{ ml: 'auto', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none' }} />
      </Button>
      <Collapse in={open}><Box id={`${instanceId}-parts`} role="group" aria-label="Available parts" sx={{ maxHeight: 195, overflow: 'auto', scrollbarGutter: 'stable', borderTop: '1px solid', borderColor: 'divider', mt: 0.5, pt: 0.5 }}>
      {lessons.map((item, itemIndex) => <Button key={item.id} fullWidth disabled={disabled} aria-label={item.title} aria-current={item.id === exercise.id ? 'step' : undefined} onClick={() => selectPart(item)} sx={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: 12, px: 1, py: 0.75, color: item.id === exercise.id ? 'primary.main' : 'text.secondary', bgcolor: item.id === exercise.id ? 'action.selected' : 'transparent', borderRadius: 1 }}>
        <Box component="span" sx={{ flexShrink: 0, width: 23, height: 23, borderRadius: '50%', display: 'grid', placeItems: 'center', border: '1px solid', borderColor: item.id === exercise.id ? 'primary.main' : 'divider', mr: 1 }}>{item.stepLetter ?? itemIndex + 1}</Box>{item.title.replace(/^[a-z]+\.\s*/i, '')}
      </Button>)}
      </Box></Collapse>
    </Box>}
  </Box>
  return <>{header}{renderContent(selector)}</>
}
