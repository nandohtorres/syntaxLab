import { Box, Typography } from '@mui/material'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import LessonSection from './LessonSection.jsx'

export default function OriginalProblem({ problem }) {
  if (!problem) return null
  return <LessonSection title="Original problem" icon={DescriptionOutlinedIcon}>
    <Typography sx={{ fontSize: 14, lineHeight: 1.8 }}>{problem.statement}</Typography>
    <Box sx={{ mt: 1.25, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
      <Typography sx={{ fontFamily: 'Consolas, monospace', fontSize: 12 }}>Input: {problem.example.input} → Output: {problem.example.output}</Typography>
      {problem.example.explanation && <Typography sx={{ fontSize: 12, mt: 0.5, color: 'text.secondary' }}>{problem.example.explanation}</Typography>}
    </Box>
    {(problem.constraints || problem.interfaceNote) && <Typography sx={{ mt: 1, fontSize: 11, lineHeight: 1.6, color: 'text.secondary' }}>{problem.constraints ?? problem.interfaceNote}</Typography>}
    <Typography component="a" href={problem.source} target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-block', fontSize: 11, mt: 0.75, color: 'primary.main' }}>{problem.adapted ? 'Practice wording; original on LeetCode' : 'Source: LeetCode'} ↗</Typography>
  </LessonSection>
}
