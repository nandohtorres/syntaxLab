import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { mono } from './editorSupport.js'
import { valueType } from './content/rapidFire.js'

// One column per kind of value, simplest first, so every variable lands somewhere predictable.
const GROUPS = [
  { label: 'Numbers', types: ['int', 'float'] },
  { label: 'Text', types: ['str'] },
  { label: 'True / False', types: ['bool'] },
  { label: 'None', types: ['None'] },
  { label: 'Lists', types: ['list'] },
  { label: 'Dicts', types: ['dict'] },
  { label: 'Functions', types: ['function'] },
]

function DataBubble({ name, value, fresh }) {
  const isFunction = valueType(value) === 'function'
  return <Box component="li" sx={theme => ({
    display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 0.75, px: 1.5, py: 0.5, borderRadius: 2.5, fontFamily: mono, fontSize: 14,
    overflowWrap: 'anywhere', border: '1px solid', borderColor: fresh ? 'primary.main' : 'transparent',
    bgcolor: alpha(theme.palette.primary.main, fresh ? 0.28 : theme.palette.mode === 'dark' ? 0.16 : 0.11),
    transition: 'background-color 0.6s, border-color 0.6s',
  })}>
    {isFunction ? <Box component="span" sx={{ fontWeight: 700 }}>{value}</Box> : <>
      <Box component="span" sx={{ fontWeight: 700 }}>{name}</Box>
      <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>=</Box>
      <Box component="span">{value}</Box>
    </>}
    <Box component="span" sx={{ fontFamily: 'inherit', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.secondary' }}>{valueType(value)}</Box>
  </Box>
}

// bubbles arrive newest first; each column keeps that order so the latest change sits on top.
export default function RapidFireDataBank({ bubbles, freshNames }) {
  if (!bubbles.length) return <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Variables you create show up here.</Typography>
  const columns = GROUPS.map(group => ({ ...group, items: bubbles.filter(([, value]) => group.types.includes(valueType(value))) })).filter(group => group.items.length)
  return <Box aria-label="Variables so far" sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2, alignItems: 'start' }}>
    {columns.map(column => <Box key={column.label} component="section" aria-label={column.label} sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary', mb: 0.75 }}>{column.label}</Typography>
      <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.75 }}>
        {column.items.map(([name, value]) => <DataBubble key={name} name={name} value={value} fresh={freshNames.includes(name)} />)}
      </Box>
    </Box>)}
  </Box>
}
