import React from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './practiceTheme.js'
import RedesignDraft from './RedesignDraft.jsx'

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}><CssBaseline /><RedesignDraft /></ThemeProvider>,
)
