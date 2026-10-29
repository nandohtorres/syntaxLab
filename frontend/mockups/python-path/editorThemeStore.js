import { useSyncExternalStore } from 'react'

// Monaco themes apply to every editor instance, including mounted hidden sections.
// Keep one preference so the toolbar always describes the actual editor theme.
let mode = 'light'
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
