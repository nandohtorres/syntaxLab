import { Typography } from '@mui/material'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LessonSection from './LessonSection.jsx'

export default function ExerciseExplanation({ exercise }) {
  return <LessonSection title="Why this works" icon={LightbulbOutlinedIcon} tone="warning">
    <Typography sx={{ fontSize: 13, lineHeight: 1.7 }}>{exercise.checkpointAnswer ?? exercise.note}</Typography>
    {exercise.pitfall && <Typography sx={{ mt: 1, fontSize: 12, lineHeight: 1.7, color: 'text.secondary' }}><strong>Watch for: </strong>{exercise.pitfall}</Typography>}
  </LessonSection>
}
