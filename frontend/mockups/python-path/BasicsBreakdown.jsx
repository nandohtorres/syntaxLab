import { Box, Button, Stack, Typography } from '@mui/material'
import QuestionBreakdown from './QuestionBreakdown.jsx'

export default function BasicsBreakdown({ exercise, lessons, topic, choose, disabled, controls, children }) {
  const unit = lessons.filter(item => item.track === exercise.track && item.unit === exercise.unit)
  const skills = [...new Set(unit.map(item => item.skillId))]
  const variations = unit.filter(item => item.skillId === exercise.skillId)
  const letter = index => String.fromCharCode(97 + index)
  const parts = skills.map((skill, index) => {
    const item = skill === exercise.skillId ? exercise : unit.find(value => value.skillId === skill)
    return { ...item, title: `${letter(index)}. ${item.title.replace(/\.$/, '')}`, stepLetter: letter(index) }
  })
  const selected = parts.find(item => item.skillId === exercise.skillId)
  return <QuestionBreakdown exercise={selected} lessons={parts} heading={topic} pattern={exercise.track === 'scripts' ? 'Optional project' : null} groupId={`${exercise.track}:${exercise.unit}`} kind="topic" choose={choose} disabled={disabled}>
    {selector => children(<>
      {selector}
      {(variations.length > 1 || controls) && <Box sx={{ mt: 1.5 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        {variations.length > 1 && <Stack direction="row" role="group" aria-label="Practice variations" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', mr: 0.5 }}>Practice variation</Typography>
          {variations.map((item, index) => <Button key={item.id} size="small" disabled={disabled} aria-label={`Variation ${index + 1} of ${variations.length}`} aria-pressed={exercise.id === item.id} onClick={() => choose(item)} sx={{ minWidth: 30, px: 1, border: '1px solid', borderColor: exercise.id === item.id ? 'primary.main' : 'divider', bgcolor: exercise.id === item.id ? 'action.selected' : 'transparent', color: exercise.id === item.id ? 'primary.main' : 'text.secondary' }}>{index + 1}</Button>)}
        </Stack>}
        {controls}
        </Stack>
      </Box>}
    </>)}
  </QuestionBreakdown>
}
