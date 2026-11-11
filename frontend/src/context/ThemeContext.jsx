import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { activeDarkTheme, darkPreview, previewPalette } from '@/utils/darkPreview'

const ThemeContext = createContext(null)
const THEME_STORAGE_KEY = 'synlab_theme_v1'
const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)'

function readSavedMode() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    return saved === 'dark' || saved === 'light' ? saved : null
  } catch { return null }
}

const systemMode = () => globalThis.matchMedia?.(DARK_SCHEME_QUERY).matches ? 'dark' : 'light'

// An explicit ?dark= palette query (color comparisons) wins, then the learner's saved choice, then the OS setting.
function initialMode() {
  if (darkPreview) return 'dark'
  return readSavedMode() ?? systemMode()
}

export function ThemeContextProvider({ children }) {
  const [themeMode, setThemeMode] = useState(initialMode)

  // Until the learner picks a theme, keep following the OS when it switches (for example at sunset).
  useEffect(() => {
    if (darkPreview || readSavedMode()) return undefined
    const query = globalThis.matchMedia?.(DARK_SCHEME_QUERY)
    if (!query) return undefined
    const follow = () => { if (!readSavedMode()) setThemeMode(systemMode()) }
    query.addEventListener('change', follow)
    return () => query.removeEventListener('change', follow)
  }, [])

  function toggleThemeMode() {
    setThemeMode(previousMode => {
      const nextMode = previousMode === 'dark' ? 'light' : 'dark'
      try { localStorage.setItem(THEME_STORAGE_KEY, nextMode) } catch { /* the choice still applies for this visit */ }
      return nextMode
    })
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
          '*': { scrollbarWidth: 'thin', scrollbarColor: `${thumb} transparent` },
          '*::-webkit-scrollbar': { width: 8, height: 8 },
          '*::-webkit-scrollbar-track': { background: 'transparent' },
          '*::-webkit-scrollbar-thumb': { backgroundColor: thumb, borderRadius: 8, border: '2px solid transparent', backgroundClip: 'padding-box' },
          '*::-webkit-scrollbar-thumb:hover': { backgroundColor: dark ? activeDarkTheme.primary : '#6e9180' },
          '*::-webkit-scrollbar-corner': { background: 'transparent' },
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
