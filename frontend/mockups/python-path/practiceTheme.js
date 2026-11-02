import { createTheme } from '@mui/material/styles'
import { previewPalette } from '../../src/utils/darkPreview.js'

// Preserve the reviewed workspace appearance inside the existing site.
export const lightPracticeTheme = createTheme({
  palette: { mode: 'light', primary: { main: '#24684f', contrastText: '#ffffff' }, background: { default: '#ffffff', paper: '#f5f8f6' }, text: { primary: '#172b3a', secondary: '#536678' }, divider: '#d7e1dc' },
  typography: { fontFamily: '"Segoe UI", Inter, system-ui, sans-serif', button: { textTransform: 'none', fontWeight: 650 } },
  shape: { borderRadius: 10 },
  components: { MuiButton: { defaultProps: { disableElevation: true } } },
})

export default createTheme({
  palette: previewPalette,
  typography: {
    fontFamily: '"Segoe UI", Inter, system-ui, sans-serif',
    button: { textTransform: 'none', fontWeight: 650 },
  },
  shape: { borderRadius: 10 },
  components: { MuiButton: { defaultProps: { disableElevation: true } } },
})
