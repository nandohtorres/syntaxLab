import { useSyncExternalStore } from 'react'
import { darkPreview } from '../../src/utils/darkPreview.js'

// Monaco themes apply to every editor instance, including mounted hidden sections.
// Keep one preference so the toolbar always describes the actual editor theme.
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
