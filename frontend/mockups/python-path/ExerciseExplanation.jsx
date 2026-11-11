import { Typography } from '@mui/material'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LessonSection from './LessonSection.jsx'

// Before the first attempt the same note reads as a hint; after a run it explains why the answer works.
export default function ExerciseExplanation({ exercise, attempted = true }) {
  return <LessonSection title={attempted ? 'Why this works' : 'Hint'} icon={LightbulbOutlinedIcon} tone="warning">
    <Typography sx={{ fontSize: 14, lineHeight: 1.7 }}>{exercise.checkpointAnswer ?? exercise.note}</Typography>
    {exercise.pitfall && <Typography sx={{ mt: 1, fontSize: 13, lineHeight: 1.7, color: 'text.secondary' }}><strong>Watch for: </strong>{exercise.pitfall}</Typography>}
  </LessonSection>
}
