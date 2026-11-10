import React from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './practiceTheme.js'
import EditorCompare from './EditorCompare.jsx'

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}><CssBaseline /><EditorCompare /></ThemeProvider>,
)
