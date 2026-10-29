import { lazy, Suspense, useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Stack, Tab, Tabs, Typography } from '@mui/material'
import { sectionFromHash, siteSections } from '@/utils/siteSections'
import ErrorBoundary from '@/components/ErrorBoundary'
import Header from '@/components/Header'
import { folderPanelStyle, folderTabStyle, islandColor } from '@/utils/tabDepthStyles'
import { isSlidingWindowSample, layoutFromSearch, StudyLayoutContext } from '@practice/layoutContext.js'

const OriginalPractice = lazy(() => import('@/pages/LeetCodePage'))
const PythonPath = lazy(() => import('@practice/PracticePreview.jsx'))
const LearningHub = lazy(() => import('@practice/learning/LearningHub.jsx'))

export default function SitePage() {
  const [section, setSection] = useState(() => sectionFromHash(location.hash))
  const [visited, setVisited] = useState(() => ({ [sectionFromHash(location.hash)]: true }))
  const layout = layoutFromSearch(location.search)
  const demo = ['island', 'flow'].includes(new URLSearchParams(location.search).get('layout'))
  const sample = isSlidingWindowSample(location.search)
  const framed = layout === 'island' || (layout === 'current' && section === 'practice')
  const bounded = framed && section !== 'learn'
  const desktop = layout === 'current' ? '@media (min-width: 900px) and (min-height: 640px)' : '@media (min-width: 900px) and (min-height: 760px)'
  useEffect(() => {
    function update() {
      const next = sectionFromHash(location.hash)
      setSection(next)
      setVisited(current => ({ ...current, [next]: true }))
    }
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  useEffect(() => {
    if (demo) document.title = `SyntaxLab - ${layout === 'island' ? 'Floating island' : 'Open practice'} preview`
  }, [demo, layout])
  function demoLink(value) {
    const url = new URL(location.href)
    url.searchParams.set('layout', value)
    return url.pathname + url.search + url.hash
  }
  const content = { practice: OriginalPractice, python: PythonPath, learn: LearningHub }
  return <StudyLayoutContext.Provider value={layout}>
    <Box data-layout-demo={layout} sx={{ minHeight: '100dvh', p: { xs: 1.5, md: framed ? 2.5 : 3 }, background: theme => framed ? (theme.palette.mode === 'dark' ? 'radial-gradient(ellipse at 15% 0%, #173230 0%, #0a1019 65%)' : 'radial-gradient(ellipse at 15% 0%, #d9eee5 0%, #f0f4fa 65%)') : theme.palette.background.default, ...(bounded && { [desktop]: { height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' } }) }}>
      {demo && !sample && <Stack component="nav" aria-label="Layout comparison" direction="row" sx={{ width: '100%', maxWidth: 1560, mx: 'auto', mb: 1.5, gap: 1, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
        <Typography sx={{ color: 'text.secondary', fontSize: 11, mr: 'auto' }}>Layout preview</Typography>
        <Button component="a" href={demoLink('island')} size="small" variant={layout === 'island' ? 'contained' : 'text'} aria-pressed={layout === 'island'}>A - Floating island</Button>
        <Button component="a" href={demoLink('flow')} size="small" variant={layout === 'flow' ? 'contained' : 'text'} aria-pressed={layout === 'flow'}>B - Open practice</Button>
      </Stack>}
      <Box sx={{ width: '100%', maxWidth: 1560, mx: 'auto', ...(framed && { p: { xs: 1.5, md: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: islandColor, boxShadow: '0 24px 80px #00000025' }), ...(bounded && { [desktop]: { flex: 1, maxHeight: 1080, minHeight: 0, display: 'flex', flexDirection: 'column' } }) }}>
        <Header />
        <Box component="nav" aria-label="SyntaxLab sections" sx={{ position: 'relative', zIndex: 1, mb: 0, flexShrink: 0 }}>
          <Tabs value={section} onChange={(_, value) => { location.hash = value }} variant="fullWidth" aria-label="Site sections" sx={{ overflow: 'visible', '& .MuiTabs-scroller': { overflow: 'visible !important' }, '& .MuiTabs-list': { gap: { xs: 0.5, sm: 1 }, alignItems: 'flex-end' }, '& .MuiTabs-indicator': { display: 'none' } }}>
            {siteSections.map(item => <Tab key={item.id} id={`site-tab-${item.id}`} aria-controls={`site-panel-${item.id}`} value={item.id} label={item.label} data-tab-treatment="folder-glass" sx={folderTabStyle} />)}
          </Tabs>
        </Box>
        {siteSections.map(item => {
          const Page = content[item.id]
          return <Box key={item.id} role="tabpanel" id={`site-panel-${item.id}`} aria-labelledby={`site-tab-${item.id}`} hidden={section !== item.id} sx={theme => ({ ...folderPanelStyle(theme), ...((bounded || item.id === 'practice') && { [desktop]: { flex: 1, minHeight: 0, ...(section === item.id && { display: 'flex', flexDirection: 'column' }) } }) })}>
            {visited[item.id] && <ErrorBoundary>
              <Suspense fallback={<Box role="status" sx={{ p: 4, display: 'flex', gap: 2, alignItems: 'center' }}><CircularProgress size={20} /><Typography>Opening {item.label}...</Typography></Box>}>
                {item.id === 'python' ? <Page scope="basics" /> : <Page />}
              </Suspense>
            </ErrorBoundary>}
          </Box>
        })}
      </Box>
    </Box>
  </StudyLayoutContext.Provider>
}
