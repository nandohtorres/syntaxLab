import { useSyncExternalStore } from 'react'
import { darkPreview } from '../../src/utils/darkPreview.js'

// One dark/light preference shared by every practice editor, so all mounted sections match the toolbar.
let mode = darkPreview ? 'dark' : 'light'
const listeners = new Set()
const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener) }
const getSnapshot = () => mode
const toggle = () => {
  mode = mode === 'light' ? 'dark' : 'light'
  listeners.forEach(listener => listener())
}
export function useEditorTheme() {
  return [useSyncExternalStore(subscribe, getSnapshot), toggle]
}
