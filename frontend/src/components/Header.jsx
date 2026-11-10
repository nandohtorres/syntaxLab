import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import BoltIcon from '@mui/icons-material/Bolt'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useThemeContext } from '@/context/ThemeContext'

const RAPID_FIRE_INFO = 'Timed typing reps that build one Python program. Pick Level 1 (storing data), 2 (using data), 3 (logic and functions) or the full 60-rep run. Bubbles show your variables, each rep has a Python tip, and the clock can be paused or hidden.'

export default function Header({ onStartRapidFire }) {
  const { themeMode, toggleThemeMode } = useThemeContext()

  const isDarkMode = themeMode === 'dark'
  const themeToggleTooltipLabel = isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <Box component="header" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexShrink: 0 }}>
      <Box aria-hidden="true" sx={{ width: 35, height: 35, flexShrink: 0, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'grid', placeItems: 'center', color: 'primary.main', fontFamily: 'Consolas, monospace', fontWeight: 700 }}>{'{ }'}</Box>
      <Typography sx={{ fontSize: 23, fontWeight: 750, letterSpacing: '-0.7px' }}>
        Syntax<Box component="span" sx={{ color: 'primary.main' }}>Lab</Box>
      </Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: 12, pl: 1.5, borderLeft: '1px solid', borderColor: 'divider', display: { xs: 'none', md: 'block' } }}>Learn python and leetcode patterns at the same time</Typography>
      {onStartRapidFire && <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
        <Button onClick={onStartRapidFire} variant="outlined" size="small" startIcon={<BoltIcon />}>Rapid fire</Button>
        <Tooltip title={RAPID_FIRE_INFO} enterTouchDelay={0} leaveTouchDelay={4000} arrow>
          <IconButton aria-label={`About rapid fire: ${RAPID_FIRE_INFO}`} size="small" sx={{ color: 'text.secondary' }}><InfoOutlinedIcon fontSize="small" /></IconButton>
        </Tooltip>
      </Box>}
      <Tooltip title={themeToggleTooltipLabel}>
        <IconButton aria-label={themeToggleTooltipLabel} onClick={toggleThemeMode} size="small" sx={{ ml: onStartRapidFire ? 0 : 'auto' }}>
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  )
}
