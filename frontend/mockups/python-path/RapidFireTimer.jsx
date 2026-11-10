import { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { mono } from './editorSupport.js'
import { elapsedMs, formatDuration } from './content/rapidFire.js'

// Owns its own ticking state so the editor above it does not re-render ten times a second.
export default function RapidFireTimer({ clock }) {
  const [now, setNow] = useState(() => Date.now())
  const ticking = clock.startedAt && !clock.finishedAt && !clock.pausedAt
  useEffect(() => {
    if (!ticking) return
    const interval = setInterval(() => setNow(Date.now()), 100)
    return () => clearInterval(interval)
  }, [ticking])
  return <Typography aria-label="Elapsed time" sx={{ fontFamily: mono, fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums', minWidth: 90, textAlign: 'right', color: clock.pausedAt ? 'text.secondary' : 'text.primary' }}>{formatDuration(elapsedMs(clock, now))}</Typography>
}
