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
    <Box component="header" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexShrink: 0 }}>
      <Box aria-hidden="true" sx={{ width: 35, height: 35, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'grid', placeItems: 'center', color: 'primary.main', fontFamily: 'Consolas, monospace', fontWeight: 700 }}>{'{ }'}</Box>
      <Typography sx={{ fontSize: 23, fontWeight: 750, letterSpacing: '-0.7px' }}>
        Syntax<Box component="span" sx={{ color: 'primary.main' }}>Lab</Box>
      </Typography>
      <Typography sx={{ ml: 'auto', color: 'text.secondary', fontSize: 12, display: { xs: 'none', sm: 'block' } }}>Learn python and leetcode patterns at the same time</Typography>
      <Tooltip title={themeToggleTooltipLabel}>
        <IconButton aria-label={themeToggleTooltipLabel} onClick={toggleThemeMode} size="small" sx={{ ml: { xs: 'auto', sm: 0 } }}>
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  )
}
