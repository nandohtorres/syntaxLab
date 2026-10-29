import { useEffect, useRef, useState } from 'react'
import { Box, Button, LinearProgress, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { alpha, keyframes } from '@mui/material/styles'

const preferenceKey = 'synlab_celebration_emblem_v1'
const emblems = [
  { id: 'rocket', symbol: '🚀', name: 'Rocket', action: 'Launch', done: 'Lift off!' },
  { id: 'spark', symbol: '⚡', name: 'Lightning', action: 'Charge', done: 'Fully charged!' },
  { id: 'star', symbol: '🌟', name: 'Star', action: 'Shine', done: 'Keep shining!' },
  { id: 'fire', symbol: '🔥', name: 'Flame', action: 'Ignite', done: 'On fire!' },
  { id: 'plant', symbol: '🌱', name: 'Seedling', action: 'Grow', done: 'A little growth!' },
]
const lift = keyframes`
  0% { transform: translateY(0) scale(1); opacity: 1; }
  45% { transform: translateY(-10px) scale(1.16); opacity: 1; }
  100% { transform: translateY(-35px) scale(.9); opacity: 0; }
`
const tapsNeeded = 6

function savedEmblem() {
  try { return emblems.find(item => item.id === localStorage.getItem(preferenceKey)) ?? emblems[0] }
  catch { return emblems[0] }
}

// A reward for a graded pass, never a second source of practice credit.
export default function PassCelebration({ onNext, onReturn }) {
  const [emblem, setEmblem] = useState(savedEmblem)
  const [taps, setTaps] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const count = useRef(0)
  const timer = useRef(null)
  const nextAction = useRef(onNext)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const complete = taps === tapsNeeded
  useEffect(() => { nextAction.current = onNext }, [onNext])
  useEffect(() => () => clearTimeout(timer.current), [])

  function dismiss() {
    clearTimeout(timer.current)
    setDismissed(true)
    onReturn()
  }
  function tap() {
    if (count.current >= tapsNeeded) return
    count.current += 1
    setTaps(count.current)
    if (count.current === tapsNeeded) timer.current = setTimeout(() => nextAction.current(), reducedMotion ? 0 : 400)
  }
  if (dismissed) return null
  return <Box component="section" aria-label="Practice celebration" onKeyDown={event => {
    if (event.key === 'Escape') { event.preventDefault(); dismiss() }
    if (event.key === 'Enter' && event.shiftKey && (event.ctrlKey || event.metaKey)) {
      event.preventDefault(); clearTimeout(timer.current); nextAction.current()
    }
  }} sx={theme => ({ position: 'absolute', inset: 0, zIndex: 2, p: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', gap: 0.5, color: theme.palette.text.primary, background: `radial-gradient(ellipse at 50% 40%, ${alpha(theme.palette.primary.main, 0.13)}, transparent 75%), ${theme.palette.background.paper}` })}>
    <Typography sx={{ fontSize: 15, fontWeight: 750 }}>One more win.</Typography>
    <Button autoFocus aria-label={`${emblem.action} celebration`} disabled={complete} disableRipple={reducedMotion} onClick={tap} sx={{ width: 112, minHeight: 100, borderRadius: '50%', p: 0, color: 'primary.main', touchAction: 'manipulation', '&:focus-visible': { outline: '2px solid', outlineOffset: 3 }, '&::before': { content: '""', position: 'absolute', inset: 8, border: '1px solid', borderColor: 'primary.main', borderRadius: '50%', opacity: 0.2 + taps / 10, transform: `scale(${0.75 + taps * 0.05})`, transition: reducedMotion ? 'none' : 'transform 120ms ease, opacity 120ms ease' } }}>
      <Box component="span" aria-hidden="true" sx={{ fontSize: 52, lineHeight: 1.25, userSelect: 'none', transform: `scale(${1 + taps * 0.045})`, transition: reducedMotion ? 'none' : 'transform 100ms ease', animation: complete && !reducedMotion ? `${lift} 400ms ease-in forwards` : 'none' }}>{emblem.symbol}</Box>
    </Button>
    <Box sx={{ width: '100%', maxWidth: 240, textAlign: 'center' }}>
      <LinearProgress aria-label="Celebration charge" variant="determinate" value={taps / tapsNeeded * 100} sx={{ height: 4, borderRadius: 2, '& .MuiLinearProgress-bar': { transition: reducedMotion ? 'none' : 'transform 120ms ease' } }} />
      <Typography role="status" sx={{ mt: 0.75, fontSize: 11, color: 'text.secondary' }}>{complete ? emblem.done : `${emblem.action}: ${taps} of ${tapsNeeded} taps · click or press Enter`}</Typography>
    </Box>
    <Stack direction="row" role="group" aria-label="Celebration symbols" spacing={0.5}>
      {emblems.map(item => <Tooltip title={item.name} key={item.id}><Button size="small" aria-label={`Choose ${item.name}`} aria-pressed={emblem.id === item.id} disabled={complete} onClick={() => {
        setEmblem(item)
        try { localStorage.setItem(preferenceKey, item.id) } catch { /* The choice still works for this visit. */ }
      }} sx={{ minWidth: 34, minHeight: 32, p: 0.5, fontSize: 19, borderRadius: 1.5, bgcolor: emblem.id === item.id ? 'action.selected' : 'transparent', border: '1px solid', borderColor: emblem.id === item.id ? 'primary.main' : 'transparent' }}><span aria-hidden="true">{item.symbol}</span></Button></Tooltip>)}
    </Stack>
    <Button size="small" onClick={dismiss} sx={{ fontSize: 11, color: 'text.secondary' }}>Back to code</Button>
  </Box>
}
