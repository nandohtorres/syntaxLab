import { useSyncExternalStore } from 'react'
import { useTheme } from '@mui/material/styles'

// Practice editors follow the site theme. An editor-only override ('light' or 'dark', null = match the site)
// is shared by every practice editor, so all mounted sections stay alike. Rapid Fire's editor is always dark.
let override = null
const listeners = new Set()
const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener) }
const getSnapshot = () => override
const setOverride = value => {
  override = value
  listeners.forEach(listener => listener())
}

// Returns [effective mode, override, setOverride].
export function useEditorTheme() {
  const siteMode = useTheme().palette.mode
  const chosen = useSyncExternalStore(subscribe, getSnapshot)
  return [chosen ?? siteMode, chosen, setOverride]
}
