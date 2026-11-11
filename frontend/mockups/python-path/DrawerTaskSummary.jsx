import { useState } from 'react'
import { ButtonBase, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TaskText from './TaskText.jsx'

// Phones: the task stays readable inside the code drawer, one line until tapped open.
// The task text itself is the button's name; aria-expanded tells whether it is shown in full.
export default function DrawerTaskSummary({ text }) {
  const [expanded, setExpanded] = useState(false)
  return <ButtonBase aria-expanded={expanded} onClick={() => setExpanded(value => !value)}
    sx={{ flexShrink: 0, width: '100%', display: 'flex', alignItems: 'flex-start', gap: 1, px: 1.5, py: 0.75, textAlign: 'left', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
    <Typography component="span" sx={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.5, ...(expanded ? { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' } : { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }) }}>
      <TaskText text={text} />
    </Typography>
    <ExpandMoreIcon aria-hidden="true" fontSize="small" sx={{ flexShrink: 0, mt: 0.25, color: 'text.secondary', transform: expanded ? 'rotate(180deg)' : 'none' }} />
  </ButtonBase>
}
