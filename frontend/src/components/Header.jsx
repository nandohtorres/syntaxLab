import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useThemeContext } from '@/context/ThemeContext'

export default function Header() {
  const { themeMode, toggleThemeMode } = useThemeContext()

  const isDarkMode = themeMode === 'dark'
  const themeToggleTooltipLabel = isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h5" fontWeight="bold" letterSpacing={1}>
        SynLab
      </Typography>
      <Tooltip title={themeToggleTooltipLabel}>
        <IconButton onClick={toggleThemeMode} size="small">
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  )
}
