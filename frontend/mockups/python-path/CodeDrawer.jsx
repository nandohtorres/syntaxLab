import { useEffect, useRef, useState } from 'react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { InCodeDrawerContext } from './layoutContext.js'
import { CODE_DRAWER_SYNC_EVENT, readDrawer, saveDrawer } from './codeDrawerStore.js'

// Phone code drawer (docs/mobile-code-drawer-plan.md): drag to any height inside a safe range, or lock it.
// Its reset control lives in the page header ("Reset code panel"), outside the drawer.
const PEEK_HEIGHT = 52
// The drawer's top border sits inside its height, so the minimum adds it to keep the whole handle on screen.
const DRAWER_BORDER = 1
const MAX_SHARE = 0.9
// Room kept above the drawer's top edge, so the handle can never be dragged under the top browser bar.
const SAFE_TOP_MARGIN = 48
const KEY_STEP = 40
const DRAG_THRESHOLD = 5

const clamp = (value, low, high) => Math.min(Math.max(value, low), high)

// env(safe-area-inset-*) is only readable through CSS, so a hidden probe element reports it.
let safeAreaProbe = null
function readSafeArea() {
  if (!globalThis.document?.body) return { top: 0, bottom: 0 }
  if (!safeAreaProbe) {
    safeAreaProbe = document.createElement('div')
    safeAreaProbe.setAttribute('aria-hidden', 'true')
    safeAreaProbe.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)'
    document.body.appendChild(safeAreaProbe)
  }
  const style = getComputedStyle(safeAreaProbe)
  return { top: parseFloat(style.paddingTop) || 0, bottom: parseFloat(style.paddingBottom) || 0 }
}

// The visible area above the phone keyboard and browser bars, so the drawer never hides behind them.
function readViewport() {
  const visual = globalThis.visualViewport
  const height = visual?.height ?? globalThis.innerHeight
  const safeArea = readSafeArea()
  return {
    height, safeTop: safeArea.top, safeBottom: safeArea.bottom,
    bottomInset: visual ? Math.max(0, Math.round(globalThis.innerHeight - visual.height - visual.offsetTop)) : 0,
  }
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
  const [saved, setSaved] = useState(() => readDrawer(storageKey))
  const [dragHeight, setDragHeight] = useState(null)
  const drag = useRef(null)
  // Safe range on every screen: the handle stays above the bottom safe area and below the top margin.
  // Saved heights are clamped into it on every render instead of being reset.
  const minHeight = PEEK_HEIGHT + DRAWER_BORDER + viewport.safeBottom
  const maxHeight = Math.max(minHeight, Math.round(Math.min(viewport.height * MAX_SHARE, viewport.height - viewport.safeTop - SAFE_TOP_MARGIN)))
  const defaultHeight = clamp(Math.round(viewport.height * defaultShare), minHeight, maxHeight)
  const height = clamp(dragHeight ?? saved.height ?? defaultHeight, minHeight, maxHeight)
  const locked = Boolean(saved.locked)
  const collapsed = height <= minHeight

  useEffect(() => {
    const reload = event => { if (event.detail?.key === storageKey) setSaved(event.detail.value) }
    globalThis.addEventListener(CODE_DRAWER_SYNC_EVENT, reload)
    return () => globalThis.removeEventListener(CODE_DRAWER_SYNC_EVENT, reload)
  }, [storageKey])

  const remember = changes => saveDrawer(storageKey, changes)

  // A tap on the handle folds the drawer down or opens it back to where it was.
  function toggleOpen() {
    if (locked) return
    if (collapsed) remember({ height: saved.openHeight ?? defaultHeight })
    else remember({ height: minHeight, openHeight: height })
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
    drag.current.currentHeight = clamp(drag.current.startHeight + distance, minHeight, maxHeight)
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
    if (step) { event.preventDefault(); remember({ height: clamp(height + step, minHeight, maxHeight) }) }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleOpen() }
  }

  return <>
    {/* Spacer: lets the page scroll its last lines up above the drawer. */}
    <Box aria-hidden="true" sx={{ height: height + viewport.bottomInset, flexShrink: 0 }} />
    <Box component="section" aria-label={title} sx={{
      position: 'fixed', left: 0, right: 0, bottom: viewport.bottomInset, height, zIndex,
      display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', color: 'text.primary',
      borderTop: '1px solid', borderColor: 'divider', borderRadius: '16px 16px 0 0', boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.18)',
      transition: dragHeight === null ? 'height 0.2s ease' : 'none', overflow: 'hidden', pb: `${viewport.safeBottom}px`,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', height: PEEK_HEIGHT, flexShrink: 0, pr: 0.5 }}>
        <Box role="separator" aria-orientation="horizontal" aria-label={`Resize ${title.toLowerCase()}. Drag, or use the arrow keys. Tap to fold.`}
          aria-valuemin={minHeight} aria-valuemax={maxHeight} aria-valuenow={Math.round(height)} tabIndex={0}
          onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={cancelDrag} onKeyDown={onHandleKey}
          sx={{ flex: 1, alignSelf: 'stretch', display: 'flex', alignItems: 'center', gap: 1.5, pl: 2, touchAction: 'none', userSelect: 'none', cursor: locked ? 'default' : 'ns-resize', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 } }}>
          <Box aria-hidden="true" sx={{ width: 36, height: 5, borderRadius: 3, bgcolor: locked ? 'action.disabled' : 'text.secondary', opacity: 0.6 }} />
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{title}</Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{locked ? 'Locked' : collapsed ? 'Tap to open' : 'Drag to resize'}</Typography>
        </Box>
        <Tooltip title={locked ? 'Unlock drawer' : 'Lock drawer here'}>
          <IconButton aria-label={locked ? 'Unlock drawer' : 'Lock drawer here'} aria-pressed={locked} onClick={() => remember({ locked: !locked })} size="small" color={locked ? 'primary' : 'default'}>
            {locked ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
      <InCodeDrawerContext.Provider value={true}>
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>{children}</Box>
      </InCodeDrawerContext.Provider>
    </Box>
  </>
}
