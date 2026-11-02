import { createContext, useContext, useState, useMemo } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { activeDarkTheme, darkPreview, previewPalette } from '@/utils/darkPreview'

const ThemeContext = createContext(null)

export function ThemeContextProvider({ children }) {
  const [themeMode, setThemeMode] = useState(darkPreview ? 'dark' : 'light')

  function toggleThemeMode() {
    setThemeMode(previousMode => previousMode === 'dark' ? 'light' : 'dark')
  }

  const muiTheme = useMemo(() => {
    const darkPalette = previewPalette

    const lightPalette = {
      mode: 'light',
      primary: { main: '#24684f' },
      secondary: { main: '#24684f' },
      background: { default: '#f0f4fa', paper: '#ffffff' },
      text: { primary: '#1a2a3a', secondary: '#5a7080' },
    }

    const dark = themeMode === 'dark'
    const track = dark ? darkPalette.background.paper : '#f5f8f6'
    const thumb = dark ? activeDarkTheme.divider : '#a3b8ac'
    return createTheme({
      palette: dark ? darkPalette : lightPalette,
      typography: {
        fontFamily: '"Segoe UI", Inter, system-ui, sans-serif',
        button: { textTransform: 'none', fontWeight: 650 },
      },
      shape: { borderRadius: 10 },
      components: {
        MuiButton: { defaultProps: { disableElevation: true } },
        MuiCssBaseline: { styleOverrides: {
          '*': { scrollbarWidth: 'thin', scrollbarColor: `${thumb} ${track}` },
          '*::-webkit-scrollbar': { width: 8, height: 8 },
          '*::-webkit-scrollbar-track': { background: track, borderRadius: 8 },
          '*::-webkit-scrollbar-thumb': { background: thumb, borderRadius: 8, border: `2px solid ${track}` },
          '*::-webkit-scrollbar-thumb:hover': { background: dark ? activeDarkTheme.primary : '#6e9180' },
          '*::-webkit-scrollbar-corner': { background: track },
        } },
      },
    })
  }, [themeMode])

  return (
    <ThemeContext.Provider value={{ themeMode, toggleThemeMode }}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeContext() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeContext must be used within ThemeContextProvider')
  return ctx
}
