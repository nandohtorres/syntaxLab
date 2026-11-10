import { useEffect, useRef, useState } from 'react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { InCodeDrawerContext } from './layoutContext.js'

// Phone code drawer (docs/mobile-code-drawer-plan.md): drag to any height, lock it, or reset it.
const PEEK_HEIGHT = 52
const MAX_SHARE = 0.9
const KEY_STEP = 40
const DRAG_THRESHOLD = 5
// Drawers sharing a storage key (one per mounted practice tab) re-read it when any of them saves.
const SYNC_EVENT = 'synlab-code-drawer-saved'

function readSaved(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}') } catch { return {} }
}

function writeSaved(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* the drawer still works for this visit */ }
}

const clamp = (value, low, high) => Math.min(Math.max(value, low), high)

// The visible area above the phone keyboard and browser bars, so the drawer never hides behind them.
function readViewport() {
  const visual = globalThis.visualViewport
  const height = visual?.height ?? globalThis.innerHeight
  return { height, bottomInset: visual ? Math.max(0, Math.round(globalThis.innerHeight - visual.height - visual.offsetTop)) : 0 }
}

function useVisibleViewport() {
  const [viewport, setViewport] = useState(readViewport)
  useEffect(() => {
    const visual = globalThis.visualViewport
    const update = () => setViewport(readViewport())
    visual?.addEventListener('resize', update)
    visual?.addEventListener('scroll', update)
    globalThis.addEventListener('resize', update)
    return () => {
      visual?.removeEventListener('resize', update)
      visual?.removeEventListener('scroll', update)
      globalThis.removeEventListener('resize', update)
    }
  }, [])
  return viewport
}

export default function CodeDrawer({ title, storageKey, defaultShare = 0.55, zIndex = 1100, children }) {
  const viewport = useVisibleViewport()
  const [saved, setSaved] = useState(() => readSaved(storageKey))
  const [dragHeight, setDragHeight] = useState(null)
  const drag = useRef(null)
  const maxHeight = Math.max(PEEK_HEIGHT, Math.round(viewport.height * MAX_SHARE))
  const defaultHeight = clamp(Math.round(viewport.height * defaultShare), PEEK_HEIGHT, maxHeight)
  const height = clamp(dragHeight ?? saved.height ?? defaultHeight, PEEK_HEIGHT, maxHeight)
  const locked = Boolean(saved.locked)
  const collapsed = height <= PEEK_HEIGHT

  useEffect(() => {
    const reload = event => { if (event.detail === storageKey) setSaved(readSaved(storageKey)) }
    globalThis.addEventListener(SYNC_EVENT, reload)
    return () => globalThis.removeEventListener(SYNC_EVENT, reload)
  }, [storageKey])

  // Merge into what is stored now, not this drawer's copy, so another tab's drawer is never overwritten.
  function remember(changes) {
    const next = { ...readSaved(storageKey), ...changes }
    writeSaved(storageKey, next)
    setSaved(next)
    globalThis.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: storageKey }))
  }

  // A tap on the handle folds the drawer down or opens it back to where it was.
  function toggleOpen() {
    if (locked) return
    if (collapsed) remember({ height: saved.openHeight ?? defaultHeight })
    else remember({ height: PEEK_HEIGHT, openHeight: height })
  }

  function startDrag(event) {
    if (locked || !event.isPrimary || event.button !== 0) return
    // Capture keeps the drag going when a finger slides off the handle; some browsers refuse it, which is fine.
    try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* drag still works without capture */ }
    drag.current = { startY: event.clientY, startHeight: height, currentHeight: height, moved: false }
  }

  function moveDrag(event) {
    if (!drag.current) return
    const distance = drag.current.startY - event.clientY
    if (Math.abs(distance) > DRAG_THRESHOLD) drag.current.moved = true
    if (!drag.current.moved) return
    // Tracked on the ref too, so releasing reads the latest height even before React re-renders.
    drag.current.currentHeight = clamp(drag.current.startHeight + distance, PEEK_HEIGHT, maxHeight)
    setDragHeight(drag.current.currentHeight)
  }

  function endDrag() {
    if (!drag.current) return
    if (drag.current.moved) remember({ height: drag.current.currentHeight })
    else toggleOpen()
    drag.current = null
    setDragHeight(null)
  }

  // The browser took the gesture over (scroll, system swipe): drop it without treating it as a tap.
  function cancelDrag() {
    drag.current = null
    setDragHeight(null)
  }

  function onHandleKey(event) {
    if (locked) return
    const step = { ArrowUp: KEY_STEP, ArrowDown: -KEY_STEP }[event.key]
    if (step) { event.preventDefault(); remember({ height: clamp(height + step, PEEK_HEIGHT, maxHeight) }) }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleOpen() }
  }

  // Escape hatch if a phone's browser bars or keyboard leave the drawer in a bad spot.
  const reset = () => remember({ height: undefined, openHeight: undefined, locked: false })

  return <>
    {/* Spacer: lets the page scroll its last lines up above the drawer. */}
    <Box aria-hidden="true" sx={{ height: height + viewport.bottomInset, flexShrink: 0 }} />
    <Box component="section" aria-label={title} sx={{
      position: 'fixed', left: 0, right: 0, bottom: viewport.bottomInset, height, zIndex,
      display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', color: 'text.primary',
      borderTop: '1px solid', borderColor: 'divider', borderRadius: '16px 16px 0 0', boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.18)',
      transition: dragHeight === null ? 'height 0.2s ease' : 'none', overflow: 'hidden',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', height: PEEK_HEIGHT, flexShrink: 0, pr: 0.5 }}>
        <Box role="separator" aria-orientation="horizontal" aria-label={`Resize ${title.toLowerCase()}. Drag, or use the arrow keys. Tap to fold.`}
          aria-valuemin={PEEK_HEIGHT} aria-valuemax={maxHeight} aria-valuenow={Math.round(height)} tabIndex={0}
          onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={cancelDrag} onKeyDown={onHandleKey}
          sx={{ flex: 1, alignSelf: 'stretch', display: 'flex', alignItems: 'center', gap: 1.5, pl: 2, touchAction: 'none', userSelect: 'none', cursor: locked ? 'default' : 'ns-resize', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 } }}>
          <Box aria-hidden="true" sx={{ width: 36, height: 5, borderRadius: 3, bgcolor: locked ? 'action.disabled' : 'text.secondary', opacity: 0.6 }} />
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{title}</Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{locked ? 'Locked' : collapsed ? 'Tap to open' : 'Drag to resize'}</Typography>
        </Box>
        <Tooltip title={locked ? 'Unlock drawer' : 'Lock drawer here'}>
          <IconButton aria-label={locked ? 'Unlock drawer' : 'Lock drawer here'} aria-pressed={locked} onClick={() => remember({ locked: !locked })} size="small" color={locked ? 'primary' : 'default'}>
            {locked ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset drawer">
          <IconButton aria-label="Reset drawer" onClick={reset} size="small"><RestartAltIcon fontSize="small" /></IconButton>
        </Tooltip>
      </Box>
      <InCodeDrawerContext.Provider value={true}>
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>{children}</Box>
      </InCodeDrawerContext.Provider>
    </Box>
  </>
}
