// Saved height and lock state for the phone code drawers (docs/mobile-code-drawer-plan.md).
// Drawers sharing a storage key (one per mounted practice tab) re-read it when any of them saves.
export const CODE_DRAWER_SYNC_EVENT = 'synlab-code-drawer-saved'
export const PRACTICE_DRAWER_KEY = 'synlab_code_drawer_v1'
export const RAPID_FIRE_DRAWER_KEY = 'synlab_rapid_fire_drawer_v1'

export function readDrawer(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}') } catch { return {} }
}

// Merge into what is stored now, not one drawer's copy, so another tab's drawer is never overwritten.
export function saveDrawer(key, changes) {
  const next = { ...readDrawer(key), ...changes }
  try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* the drawer still works for this visit */ }
  globalThis.dispatchEvent(new CustomEvent(CODE_DRAWER_SYNC_EVENT, { detail: { key, value: next } }))
  return next
}

// Used by the page header's "Reset code panel" control, which lives outside the drawer.
export const resetDrawer = key => saveDrawer(key, { height: undefined, openHeight: undefined, locked: false })
