import { lazy, Suspense, useEffect, useState } from 'react'
import { Box, CircularProgress, Tab, Tabs, ThemeProvider, Typography } from '@mui/material'
import { sectionFromHash, siteSections } from '@/utils/siteSections'
import ErrorBoundary from '@/components/ErrorBoundary'
import practiceTheme from '@practice/practiceTheme.js'

const OriginalPractice = lazy(() => import('@/pages/MainPage'))
const PythonPath = lazy(() => import('@practice/PracticePreview.jsx'))
const InterviewPrep = lazy(() => import('@practice/interview/InterviewPractice.jsx'))

export default function SitePage() {
  const [section, setSection] = useState(() => sectionFromHash(location.hash))
  const [visited, setVisited] = useState(() => ({ [sectionFromHash(location.hash)]: true }))

  useEffect(() => {
    function update() {
      const next = sectionFromHash(location.hash)
      setSection(next)
      setVisited(current => ({ ...current, [next]: true }))
    }
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  const content = { practice: OriginalPractice, python: PythonPath, interview: InterviewPrep }
  return <>
    <Box component="nav" aria-label="SyntaxLab sections" sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', px: { xs: 1, sm: 3 } }}>
      <Tabs value={section} onChange={(_, value) => { location.hash = value }} variant="scrollable" scrollButtons="auto" aria-label="Site sections">
        {siteSections.map(item => <Tab key={item.id} id={`site-tab-${item.id}`} aria-controls={`site-panel-${item.id}`} value={item.id} label={item.label} />)}
      </Tabs>
    </Box>
    {siteSections.map(item => {
      const Page = content[item.id]
      return <Box key={item.id} role="tabpanel" id={`site-panel-${item.id}`} aria-labelledby={`site-tab-${item.id}`} hidden={section !== item.id}>
        {visited[item.id] && <ErrorBoundary>
          <Suspense fallback={<Box role="status" sx={{ p: 4, display: 'flex', gap: 2, alignItems: 'center' }}><CircularProgress size={20} /><Typography>Opening {item.label}…</Typography></Box>}>
            {item.id === 'practice' ? <Page /> : <ThemeProvider theme={practiceTheme}><Box sx={{ color: 'text.primary', bgcolor: 'background.default', minHeight: 'calc(100dvh - 49px)' }}><Page /></Box></ThemeProvider>}
          </Suspense>
        </ErrorBoundary>}
      </Box>
    })}
  </>
}
