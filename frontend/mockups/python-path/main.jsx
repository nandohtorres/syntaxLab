import React from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'
import PracticeWorkspace from './PracticeWorkspace.jsx'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#98e7c4', contrastText: '#0c251b' },
    background: { default: '#0c111b', paper: '#111925' },
    text: { primary: '#edf1f7', secondary: '#8d9bb0' },
    divider: '#253042',
  },
  typography: {
    fontFamily: '"Segoe UI", Inter, system-ui, sans-serif',
    button: { textTransform: 'none', fontWeight: 650 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiTooltip: { defaultProps: { arrow: true } },
  },
})

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <PracticeWorkspace />
  </ThemeProvider>,
)
