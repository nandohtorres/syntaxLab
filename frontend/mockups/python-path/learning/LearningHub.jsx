import { useState } from 'react'
import { Box, Button, Link, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { pythonFacts, pythonQuirks, pythonTopics } from './pythonGuide.js'
import { patternModules } from '../content/catalog.js'
import { patternLearningOrder } from '../content/learningPath.js'
import { patternGuide } from '../content/patternGuide.js'
import PatternVisual from './PatternVisual.jsx'
import PatternWalkthrough from './PatternWalkthrough.jsx'

const card = { border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', minWidth: 0 }
const mono = '"Cascadia Code", Consolas, monospace'
function CodeExample({ code, output }) {
  return <Box sx={{ mt: 2 }}>
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      <Typography sx={{ px: 1.5, py: 0.75, fontSize: 10, fontWeight: 700, color: 'text.secondary', bgcolor: 'action.hover', letterSpacing: 1 }}>PYTHON</Typography>
      <Box component="pre" sx={{ m: 0, p: 2, overflowX: 'auto', fontFamily: mono, fontSize: 13, lineHeight: 1.9 }}><code>{code}</code></Box>
    </Box>
    <Box sx={theme => ({ mt: 1, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.06) })}>
      <Typography sx={{ fontSize: 10, fontWeight: 750, color: 'primary.main', mb: 0.5, letterSpacing: 1 }}>OUTPUT</Typography>
      <Box component="pre" sx={{ m: 0, fontFamily: mono, fontSize: 13, whiteSpace: 'pre-wrap' }}>{output}</Box>
    </Box>
  </Box>
}

function JumpButton({ target, children, icon }) {
  return <Button size="small" startIcon={icon} onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })}>{children}</Button>
}

export default function LearningHub() {
  const [topicId, setTopicId] = useState(pythonTopics[0].id)
  const [patternId, setPatternId] = useState('P06')
  const topicIndex = pythonTopics.findIndex(item => item.id === topicId)
  const topic = pythonTopics[topicIndex]
  const guide = patternGuide[patternId]
  const groups = [...new Set(pythonTopics.map(item => item.group))]
  return <Box component="main" sx={{ width: '100%', minWidth: 0, pb: 1 }}>
    <Box sx={{ ...card, p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Stack direction="row" sx={{ alignItems: 'baseline', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
        <Typography component="h1" sx={{ fontSize: { xs: 30, md: 38 }, fontWeight: 750, letterSpacing: '-1px' }}>Learning Python</Typography>
        <Link href="https://docs.python.org/3.12/tutorial/" target="_blank" rel="noopener noreferrer" underline="hover" sx={{ fontSize: 11, color: 'text.secondary' }}>Based on Python's official documentation</Link>
      </Stack>
      <Typography sx={{ mt: 0.75, fontSize: 15, color: 'text.secondary' }}>The Python behind your practice, one small concept at a time.</Typography>
      <Stack component="nav" aria-label="Learning Hub sections" direction="row" sx={{ gap: 0.5, mt: 1.5, flexWrap: 'wrap' }}>
        <JumpButton target="hub-python" icon={<CodeOutlinedIcon fontSize="small" />}>Python guide</JumpButton>
        <JumpButton target="hub-patterns" icon={<VisibilityOutlinedIcon fontSize="small" />}>Pattern breakdowns</JumpButton>
        <JumpButton target="hub-quirks" icon={<AutoStoriesOutlinedIcon fontSize="small" />}>Python quirks</JumpButton>
      </Stack>

      <Box component="section" aria-labelledby="hub-facts-title" sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography component="h2" id="hub-facts-title" sx={{ fontSize: 18, fontWeight: 700 }}>A few Python fun facts</Typography>
        <Box component="ul" sx={{ m: 0, mt: 1, pl: 2, '& li': { pl: 0.5, mb: 0.75, fontSize: 13, color: 'text.secondary', lineHeight: 1.8 }, '& li::marker': { color: 'primary.main' } }}>
          {pythonFacts.map(item => <Box component="li" key={item.title}>{item.text}</Box>)}
        </Box>
      </Box>
    </Box>

    <Box component="section" id="hub-python" aria-labelledby="hub-python-title" sx={{ scrollMarginTop: 20 }}>
      <Typography component="h2" id="hub-python-title" sx={{ fontSize: 25, fontWeight: 700 }}>Python, step by step</Typography>
      <Typography sx={{ mt: 0.5, mb: 2, fontSize: 13, color: 'text.secondary' }}>Start with values and collections. Build toward reusable code.</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '235px minmax(0, 1fr)' }, gap: 2, alignItems: 'stretch' }}>
        <Box component="nav" aria-label="Python topics" sx={{ ...card, position: 'relative', overflow: 'hidden', display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ position: 'absolute', inset: 0, p: 1, overflow: 'auto' }}>
          {groups.map(group => <Box key={group} sx={{ mb: 1.5 }}><Typography sx={{ px: 1, py: 0.75, fontSize: 10, fontWeight: 750, color: 'text.secondary', letterSpacing: 0.6 }}>{group}</Typography>{pythonTopics.filter(item => item.group === group).map(item => <Button key={item.id} fullWidth aria-current={topicId === item.id ? 'step' : undefined} aria-controls="hub-topic" onClick={() => setTopicId(item.id)} sx={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: 12, px: 1, py: 0.75, borderRadius: 1.5, color: topicId === item.id ? 'primary.main' : 'text.secondary', bgcolor: topicId === item.id ? 'action.selected' : 'transparent' }}>{String(pythonTopics.indexOf(item) + 1).padStart(2, '0')}<Box component="span" sx={{ ml: 1 }}>{item.title}</Box></Button>)}</Box>)}
          </Box>
        </Box>
        <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <TextField select fullWidth size="small" label="Choose a Python topic" value={topicId} onChange={event => setTopicId(event.target.value)} sx={{ display: { xs: 'block', md: 'none' }, mb: 1.5 }}>
            {pythonTopics.map((item, index) => <MenuItem key={item.id} value={item.id} sx={{ whiteSpace: 'normal', fontSize: 13 }}>{index + 1}. {item.title}</MenuItem>)}
          </TextField>
          <Box component="article" id="hub-topic" aria-label="Python lesson" sx={{ ...card, flex: 1, p: { xs: 2, sm: 3 } }}>
            <Typography sx={{ fontSize: 10, fontWeight: 750, color: 'primary.main', letterSpacing: 1 }}>{topic.group} · {topicIndex + 1} / {pythonTopics.length}</Typography>
            <Typography component="h3" sx={{ fontSize: 24, fontWeight: 650, mt: 0.75 }}>{topic.title}</Typography>
            <Typography sx={{ fontSize: 14, lineHeight: 1.8, color: 'text.secondary', mt: 1 }}>{topic.summary}</Typography>
            <CodeExample code={topic.code} output={topic.output} />
            <Typography sx={{ fontSize: 12, lineHeight: 1.8, mt: 1.5 }}><Box component="strong" sx={{ color: 'primary.main' }}>Remember: </Box>{topic.remember}</Typography>
            <Stack direction="row" sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              <Button size="small" disabled={topicIndex === 0} onClick={() => setTopicId(pythonTopics[topicIndex - 1].id)}>Previous topic</Button>
              <Button size="small" disabled={topicIndex === pythonTopics.length - 1} endIcon={<ArrowForwardIcon fontSize="small" />} onClick={() => setTopicId(pythonTopics[topicIndex + 1].id)}>Next topic</Button>
            </Stack>
            <Button size="small" component="a" href={topic.source} target="_blank" rel="noopener noreferrer" sx={{ mt: 0.5, fontSize: 11, color: 'text.secondary' }}>Python documentation ↗</Button>
          </Box>
        </Box>
      </Box>
    </Box>

    <Box component="section" id="hub-patterns" aria-labelledby="hub-patterns-title" sx={{ mt: 3, scrollMarginTop: 20 }}>
      <Typography component="h2" id="hub-patterns-title" sx={{ fontSize: 25, fontWeight: 700 }}>Leetcode Pattern Breakdowns</Typography>
      <Typography sx={{ mt: 0.5, mb: 2, fontSize: 13, color: 'text.secondary' }}>See the structure, follow a worked example, and understand why each move works.</Typography>
      <Box sx={{ ...card, p: { xs: 2, sm: 3 } }}>
        <TextField select fullWidth size="small" label="Choose a pattern" value={patternId} onChange={event => setPatternId(event.target.value)} sx={{ maxWidth: 420 }}>
          {patternLearningOrder.map((id, index) => <MenuItem key={id} value={id} sx={{ whiteSpace: 'normal', fontSize: 13 }}>{index + 1}. {patternModules.find(item => item.id === id).title}</MenuItem>)}
        </TextField>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) minmax(0, 1fr)' }, gap: { xs: 2, md: 4 }, mt: 2, alignItems: 'center' }}>
          <Box component="section" aria-label="Pattern illustration" sx={{ minWidth: 0, p: 1, bgcolor: 'action.hover', borderRadius: 2 }}><PatternVisual key={patternId} unit={patternId} /></Box>
          <Box><Typography component="h3" sx={{ fontSize: 22, fontWeight: 700 }}>{guide[0]}</Typography><Typography sx={{ fontSize: 13, lineHeight: 1.8, mt: 1 }}><strong>Look for:</strong> {guide[1]}</Typography><Typography sx={{ fontSize: 13, lineHeight: 1.8, mt: 1 }}><strong>Key idea:</strong> {guide[3]}</Typography><Typography sx={{ fontSize: 12, lineHeight: 1.8, color: 'text.secondary', mt: 1 }}><strong>Watch for:</strong> {guide[4]}</Typography><Button size="small" endIcon={<ArrowForwardIcon fontSize="small" />} onClick={() => { location.hash = 'practice' }} sx={{ mt: 1.5 }}>Open LeetCode Patterns</Button></Box>
        </Box>
        <PatternWalkthrough unit={patternId} />
      </Box>
    </Box>

    <Box component="section" id="hub-quirks" aria-labelledby="hub-quirks-title" sx={{ mt: 3, scrollMarginTop: 20 }}>
      <Typography component="h2" id="hub-quirks-title" sx={{ fontSize: 25, fontWeight: 700 }}>Python Quirks</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '1fr 1fr' }, gap: 1.5, mt: 2 }}>
        {pythonQuirks.map(item => <Box component="article" key={item.id} sx={{ ...card, p: 2 }}><Typography component="h3" sx={{ fontSize: 16, fontWeight: 700 }}>{item.title}</Typography><Typography sx={{ fontSize: 13, lineHeight: 1.8, color: 'text.secondary', mt: 0.75 }}>{item.text}</Typography><CodeExample code={item.code} output={item.output} /></Box>)}
      </Box>
    </Box>
    <Box sx={{ mt: 2 }}><Button onClick={() => { location.hash = 'python' }} endIcon={<ArrowForwardIcon fontSize="small" />}>Open Python Basics</Button></Box>
  </Box>
}
