import { lazy, Suspense } from 'react'
import { Typography } from '@mui/material'
import { isSlidingWindowSample } from '@practice/layoutContext.js'

const PatternPractice = lazy(() => import('@practice/PracticePreview.jsx'))

export default function LeetCodePage() {
  return <Suspense fallback={<Typography role="status">Opening practice...</Typography>}>
    <PatternPractice scope={isSlidingWindowSample(location.search) ? 'sliding-window' : 'algorithms'} />
  </Suspense>
}
