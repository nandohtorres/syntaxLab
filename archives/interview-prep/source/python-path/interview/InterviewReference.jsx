import { useState } from 'react'
import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material'
import { categories, filterReference, httpCodes } from './referenceSheet.js'
import { corrections, references } from './sources.js'

function Sources({ ids }) {
  return <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>{ids.map(id => references[id] && <Button key={id} component="a" href={references[id][1]} target="_blank" rel="noopener noreferrer" size="small">{references[id][0]}</Button>)}</Stack>
}

export default function InterviewReference() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const topics = filterReference(query, category)
  const showHttp = (category === 'all' || category === 'web') && (!query.trim() || /http|status|\b[1-5]\d\d\b/i.test(query))
  const codes = httpCodes.filter(row => !query.trim() || /http|status/i.test(query) || row.join(' ').toLowerCase().includes(query.toLowerCase()))
  return <Box component="main" sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1.5, sm: 3 }, '@media print': { p: 0, '& .reference-tools': { display: 'none' }, '& details': { display: 'none' } } }}>
    <Typography component="h1" sx={{ fontSize: { xs: 27, sm: 34 }, fontWeight: 700 }}>Software engineering interview reference</Typography>
    <Typography sx={{ mt: 1, mb: 2, color: 'text.secondary', fontSize: 14 }}>Quick explanations, concrete examples and deeper notes when you need them. Start with a category or search. No quizzes or Python download.</Typography>
    <Stack className="reference-tools" direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
      <TextField label="Search interview topics" placeholder="Try SQL joins, SOLID, cache or 401" size="small" value={query} onChange={event => setQuery(event.target.value)} sx={{ flex: 1 }} />
      <Button onClick={() => { setQuery(''); setCategory('all') }}>Clear filters</Button><Button onClick={() => window.print()}>Print shown topics</Button>
    </Stack>
    <Stack className="reference-tools" component="nav" aria-label="Reference categories" direction="row" sx={{ gap: 1, flexWrap: 'wrap', mb: 2 }}>
      {[['all', 'Everything'], ...categories].map(([id, title]) => <Chip key={id} label={title} variant={category === id ? 'filled' : 'outlined'} color={category === id ? 'primary' : 'default'} onClick={() => setCategory(id)} aria-pressed={category === id} />)}
    </Stack>
    <Typography role="status" sx={{ color: 'text.secondary', fontSize: 12, mb: 2 }}>{topics.length} matching topics{showHttp && codes.length ? ' · HTTP quick lookup below' : ''}</Typography>
    {showHttp && codes.length > 0 && <Box component="section" aria-labelledby="http-lookup" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, mb: 3 }}>
      <Typography id="http-lookup" component="h2" sx={{ fontSize: 20, mb: 1 }}>HTTP status quick lookup</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 1 }}>{codes.map(([code, title, meaning]) => <Typography key={code} sx={{ fontSize: 12, lineHeight: 1.7 }}><Box component="strong" sx={{ color: 'primary.main' }}>{code}</Box> {title} — {meaning}</Typography>)}</Box>
      <Sources ids={['status']} />
    </Box>}
    {!topics.length && !(showHttp && codes.length) && <Typography sx={{ py: 3 }}>No matching topics. Try a shorter search or clear the category filter.</Typography>}
    {categories.map(([id, title]) => {
      const items = topics.filter(topic => topic.category === id)
      if (!items.length) return null
      return <Box component="section" key={id} aria-labelledby={`reference-${id}`} sx={{ mb: 3 }}>
        <Typography id={`reference-${id}`} component="h2" sx={{ fontSize: 22, mb: 1.5 }}>{title}</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5, alignItems: 'start' }}>
          {items.map(topic => <Box component="article" key={topic.id} sx={{ minWidth: 0, p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, breakInside: 'avoid' }}>
            <Typography component="h3" sx={{ fontSize: 17, fontWeight: 650 }}>{topic.title}</Typography>
            <Typography sx={{ fontSize: 13, lineHeight: 1.7, my: 1 }}>{topic.summary}</Typography>
            <Typography component="pre" sx={{ fontFamily: 'Consolas, monospace', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: 12, lineHeight: 1.7, color: 'primary.main', bgcolor: '#98e7c408', p: 1, borderRadius: 1 }}>{topic.example}</Typography>
            <Box component="details"><Typography component="summary" sx={{ cursor: 'pointer', fontSize: 12, color: 'text.secondary' }}>Details, pitfalls & sources</Typography><Box component="ul" sx={{ pl: 2 }}>{topic.notes.map(note => <Typography component="li" key={note} sx={{ fontSize: 13, lineHeight: 1.8, mb: 1 }}>{note}</Typography>)}</Box><Sources ids={topic.sources} /></Box>
          </Box>)}
        </Box>
      </Box>
    })}
    <Box component="details" sx={{ mt: 3 }}><Typography component="summary" sx={{ cursor: 'pointer', fontSize: 13 }}>Technical corrections & scope notes</Typography>{corrections.map(([title, , explanation, ids]) => <Box key={title} sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}><Typography component="h3" sx={{ fontSize: 15 }}>{title}</Typography><Typography sx={{ fontSize: 13, lineHeight: 1.8 }}>{explanation}</Typography><Sources ids={ids} /></Box>)}</Box>
  </Box>
}
