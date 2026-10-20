import React, { useEffect, useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import PracticePreview from './PracticePreview.jsx'
import InterviewPractice from './interview/InterviewPractice.jsx'

const sectionFromHash = () => location.hash === '#interview' ? 'interview' : 'python'
export default function PracticeWorkspace() {
  const [section, setSection] = useState(sectionFromHash)
  const [visited, setVisited] = useState(() => ({ [sectionFromHash()]: true }))
  useEffect(() => {
    const update = () => { const next = sectionFromHash(); setSection(next); setVisited(current => ({ ...current, [next]: true })) }
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  return <>
    <Tabs value={section} onChange={(_, value) => { location.hash = value }} aria-label="Practice sections" sx={{ px: { xs: 1, sm: 4 }, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Tab value="python" label="Python Path" id="python-tab" aria-controls="python-panel" /><Tab value="interview" label="Interview prep" id="interview-tab" aria-controls="interview-panel" />
    </Tabs>
    <Box role="tabpanel" id="python-panel" aria-labelledby="python-tab" hidden={section !== 'python'}>{visited.python && <PracticePreview />}</Box>
    <Box role="tabpanel" id="interview-panel" aria-labelledby="interview-tab" hidden={section !== 'interview'}>{visited.interview && <InterviewPractice />}</Box>
  </>
}
