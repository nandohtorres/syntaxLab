import { useState, useEffect, useRef } from 'react'
import { keyframes } from '@mui/system'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const edgeWobble = keyframes`
  0%   { border-radius: 6px 2px 8px 2px / 2px 8px 2px 6px; }
  25%  { border-radius: 2px 10px 2px 6px / 10px 2px 8px 2px; }
  50%  { border-radius: 10px 2px 6px 2px / 2px 6px 2px 10px; }
  75%  { border-radius: 2px 6px 2px 10px / 8px 2px 10px 2px; }
  100% { border-radius: 6px 2px 8px 2px / 2px 8px 2px 6px; }
`

const ambientFlash = keyframes`
  0%   { opacity: 0.3; }
  50%  { opacity: 0.85; }
  100% { opacity: 0.3; }
`

const windowFlash = keyframes`
  0%   { opacity: 0; }
  25%  { opacity: 0.72; }
  100% { opacity: 0; }
`

const DECAY_DELAY_MS = 500
const DECAY_RATE_MS = 280
const FLASH_COLOR = '#4fc3f7'

function getLevelColor(progress) {
  if (progress < 0.35) return '#6495ED'
  if (progress < 0.6)  return '#7EC8A4'
  if (progress < 0.8)  return '#f5a623'
  return '#4fc3f7'
}

function getLabel(progress) {
  if (progress === 0)   return 'Click to Launch!'
  if (progress < 0.35)  return 'Ignition...'
  if (progress < 0.6)   return 'Fueling up...'
  if (progress < 0.85)  return '3... 2... 1...'
  return 'BLAST OFF!!!'
}

export default function PopButton({ onPopped, emblem = '🚀' }) {
  const isMobile = useMediaQuery('(max-width:600px)')
  const [maxLevel] = useState(() => Math.floor(Math.random() * 3) + 6) // random 6–8
  const [popLevel, setPopLevel] = useState(0)
  const [isPopping, setIsPopping] = useState(false)
  const lastClickTimeRef = useRef(null)
  const popLevelRef = useRef(0)
  const isPoppingRef = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPoppingRef.current || popLevelRef.current <= 0 || lastClickTimeRef.current === null) return
      const elapsed = Date.now() - lastClickTimeRef.current
      if (elapsed > DECAY_DELAY_MS) {
        popLevelRef.current = Math.max(0, popLevelRef.current - 1)
        setPopLevel(popLevelRef.current)
      }
    }, DECAY_RATE_MS)
    return () => clearInterval(interval)
  }, [])

  function handleClick() {
    if (isPoppingRef.current) return
    lastClickTimeRef.current = Date.now()
    const next = Math.min(maxLevel, popLevelRef.current + 1)
    popLevelRef.current = next
    setPopLevel(next)

    if (next >= maxLevel) {
      isPoppingRef.current = true
      setIsPopping(true)
      setTimeout(() => onPopped(), 750)
    }
  }

  const progress = popLevel / maxLevel
  const color = getLevelColor(progress)
  const borderWidth = 2 + progress * 4
  const glowSize = 6 + progress * 36
  const wobbleSpeed = Math.max(0.18, 1.2 - progress * 1.05)
  const flashSpeed = Math.max(0.3, 1.4 - progress * 1.1)
  const rocketSize = isMobile ? 4 + progress * 4 : 7.5 + progress * 7    // mobile: 4–8rem, desktop: 7.5–14.5rem
  const labelSize  = isMobile ? 1.4 + progress * 0.6 : 2.5 + progress * 1 // mobile: 1.4–2rem, desktop: 2.5–3.5rem

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        cursor: 'pointer',
        overflow: 'hidden',
        border: `${borderWidth}px solid ${color}`,
        boxShadow: `inset 0 0 ${glowSize}px ${color}33, 0 0 ${glowSize}px ${color}44`,
        animation: popLevel > 0 && !isPopping
          ? `${edgeWobble} ${wobbleSpeed}s linear infinite`
          : 'none',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, border-width 0.1s ease',
      }}
    >
      {/* Fill from bottom */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: `${progress * 100}%`,
          bgcolor: `${color}28`,
          transition: 'height 0.12s ease, background-color 0.2s ease',
        }}
      />

      {/* Ambient color flash layer */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: `${color}18`,
          pointerEvents: 'none',
          animation: `${ambientFlash} ${flashSpeed}s ease-in-out infinite`,
          transition: 'background-color 0.2s ease',
        }}
      />

      {/* Window flash on pop */}
      {isPopping && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: FLASH_COLOR,
            pointerEvents: 'none',
            animation: `${windowFlash} 0.75s ease-out forwards`,
          }}
        />
      )}

      {/* Emoji — centered in top 70% of container so text has room at bottom */}
      <Box
        sx={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: '30%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <Typography
          sx={{
            fontSize: `${rocketSize}rem`,
            lineHeight: 1,
            filter: `drop-shadow(0 0 ${6 + progress * 20}px ${color})`,
            transition: 'font-size 0.12s ease, filter 0.15s ease',
            userSelect: 'none',
          }}
        >
          {emblem}
        </Typography>
      </Box>

      {/* Text anchored at bottom 30% zone */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '4%', left: 0, right: 0,
          height: '30%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          px: 2,
        }}
      >
        <Typography
          sx={{
            color,
            fontWeight: 800,
            fontSize: `${labelSize}rem`,
            textShadow: `0 0 ${8 + progress * 20}px ${color}cc`,
            letterSpacing: '0.04em',
            textAlign: 'center',
            transition: 'font-size 0.12s ease, color 0.2s ease, text-shadow 0.15s ease',
            userSelect: 'none',
          }}
        >
          {getLabel(progress)}
        </Typography>
      </Box>
    </Box>
  )
}
