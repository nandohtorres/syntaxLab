import { createTheme } from '@mui/material/styles'

// Preserve the reviewed workspace appearance inside the existing site.
export const lightPracticeTheme = createTheme({
  palette: { mode: 'light', primary: { main: '#24684f', contrastText: '#ffffff' }, background: { default: '#ffffff', paper: '#f5f8f6' }, text: { primary: '#172b3a', secondary: '#536678' }, divider: '#d7e1dc' },
  typography: { fontFamily: '"Segoe UI", Inter, system-ui, sans-serif', button: { textTransform: 'none', fontWeight: 650 } },
  shape: { borderRadius: 10 },
  components: { MuiButton: { defaultProps: { disableElevation: true } } },
})

export default createTheme({
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
  components: { MuiButton: { defaultProps: { disableElevation: true } } },
})
