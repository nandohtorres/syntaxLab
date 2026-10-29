import { useState } from 'react'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import LessonSection from './LessonSection.jsx'
import { Box, Button, Stack, Typography } from '@mui/material'

const fixed = {
  values: [2, 1, 5, 1, 3, 2],
  states: [
    [0, 2, true, 'Start: 2 + 1 + 5 = 8. The window contains exactly 3 items.'],
    [1, 3, true, 'Slide: 8 - 2 + 1 = 7. Remove the old left item; add the new right item.'],
    [2, 4, true, 'Slide: 7 - 1 + 3 = 9. This is the best total so far.'],
    [3, 5, true, 'Slide: 9 - 5 + 2 = 6. The best total remains 9.'],
  ],
}
const unique = {
  values: [...'abba'],
  states: [
    [0, 0, true, 'Add a. One character; no duplicates.'],
    [0, 1, true, 'Add b. The window ab is still unique.'],
    [0, 2, false, 'Add b. The window abb now has two copies of b. Shrink from the left.'],
    [1, 2, false, 'Remove a. The window bb STILL has a duplicate. One left move was not enough.'],
    [2, 2, true, 'Remove the first b. The remaining b is valid. This is why shrinking uses while.'],
    [2, 3, true, 'Add a. The window ba is valid. The longest valid length seen is 2.'],
  ],
}
const distinct = {
  values: [...'eceba'],
  states: [
    [0, 0, true, 'k = 2. Start with e: one distinct character.'],
    [0, 1, true, 'Add c: ec contains two distinct characters.'],
    [0, 2, true, 'Add e: ece is valid! Repeated characters are allowed. Length is 3.'],
    [0, 3, false, 'Add b: eceb has three distinct characters. Shrink.'],
    [1, 3, false, 'Remove the first e: ceb still has three distinct characters. Keep shrinking.'],
    [2, 3, true, 'Remove c and its zero-count key: eb has two distinct characters again.'],
    [2, 4, false, 'Add a: eba has three distinct characters. Shrink again.'],
    [3, 4, true, 'Remove e: ba is valid. The longest valid length seen remains 3.'],
  ],
}

const replacements = {
  values: [...'ABAB'],
  states: [
    [0, 0, true, 'k = 1. A needs no replacements.'],
    [0, 1, true, 'AB needs one replacement. The window is valid.'],
    [0, 2, true, 'ABA has two As. Replacing its one B gives length 3.'],
    [0, 3, false, 'ABAB has length 4 and maximum frequency 2: it needs two replacements, beyond k = 1.'],
    [1, 3, true, 'Remove the first A. BAB needs one replacement. The best valid length is 3.'],
  ],
}
const coverage = {
  values: [...'BAAC'],
  states: [
    [0, 0, false, 'Target AC: B covers neither required character.'],
    [0, 1, false, 'BA covers A but still needs C.'],
    [0, 2, false, 'BAA has an extra A, but still needs C. Distinct-letter counts alone do not establish coverage.'],
    [0, 3, true, 'BAAC covers AC. Record length 4, then try shrinking while coverage holds.'],
    [1, 3, true, 'Remove B. AAC still covers the target; improve the best length to 3.'],
    [2, 3, true, 'Remove one extra A. AC still covers the target; the best length is now 2.'],
    [3, 3, false, 'Removing the remaining A loses coverage. Keep the last valid answer: AC.'],
  ],
}

export default function SlidingWindowGuide({ exercise }) {
  const [step, setStep] = useState(0)
  const trace = exercise.problemId === 424 ? replacements : exercise.problemId === 76 ? coverage : exercise.id === 'sw-at-most-k' ? distinct : exercise.stage === 'Fixed-size window' ? fixed : unique
  const [left, right, valid, caption] = trace.states[step]
  return <LessonSection title="Visual example" icon={VisibilityOutlinedIcon} tone="info">
    <Box sx={{ mt: 1 }}>
      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Step through the window to see what changes.</Typography>
      <Box sx={{ mt: 1.5, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Stack direction="row" aria-label="Input values" sx={{ gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          {trace.values.map((value, index) => <Box key={index} sx={{ textAlign: 'center' }}>
            <Box sx={{ width: 32, py: 0.75, border: '2px solid', borderColor: index >= left && index <= right ? valid ? 'primary.main' : 'warning.main' : 'divider', borderRadius: 1, bgcolor: index >= left && index <= right ? 'action.selected' : 'transparent', fontWeight: 650 }}>{value}</Box>
            <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>{index}</Typography>
          </Box>)}
        </Stack>
        <Box role="status" aria-live="polite">
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: valid ? 'primary.main' : 'warning.dark' }}>Current window: indexes {left}–{right} · {trace === coverage ? valid ? 'Coverage complete' : 'Incomplete coverage' : valid ? 'Valid' : 'Invalid — shrink'}</Typography>
          <Typography sx={{ fontSize: 12, mt: 0.5 }}>{caption}</Typography>
        </Box>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <Button size="small" disabled={step === 0} onClick={() => setStep(value => value - 1)}>Previous move</Button>
          <Typography sx={{ fontSize: 11 }}>{step + 1} / {trace.states.length}</Typography>
          <Button size="small" disabled={step === trace.states.length - 1} onClick={() => setStep(value => value + 1)}>Next move</Button>
        </Stack>
      </Box>
    </Box>
  </LessonSection>
}
