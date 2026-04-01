import { createContext, useContext, useState, useMemo } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const ThemeContext = createContext(null)

export function ThemeContextProvider({ children }) {
  const [themeMode, setThemeMode] = useState('dark')

  function toggleThemeMode() {
    setThemeMode(previousMode => previousMode === 'dark' ? 'light' : 'dark')
  }

  const muiTheme = useMemo(() => {
    const darkPalette = {
      mode: 'dark',
      primary: { main: '#6495ED' },
      secondary: { main: '#7EC8A4' },
      background: { default: '#0f1923', paper: '#162032' },
      text: { primary: '#e8edf4', secondary: '#8fa3bf' },
    }

    const lightPalette = {
      mode: 'light',
      primary: { main: '#4a7fd4' },
      secondary: { main: '#5aab87' },
      background: { default: '#f0f4fa', paper: '#ffffff' },
      text: { primary: '#1a2a3a', secondary: '#5a7080' },
    }

    return createTheme({ palette: themeMode === 'dark' ? darkPalette : lightPalette })
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
