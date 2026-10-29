import { useSyncExternalStore } from 'react'
import { savedLessonInventory as lessons } from './content/savedLessonInventory.js'
import { createPracticeStore } from './practiceStore.js'

const store = createPracticeStore(() => window.localStorage, lessons)
window.addEventListener('pagehide', store.flush)
const getReplacement = () => store.getSnapshot().replacement

export default function usePracticeData() {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot)
  return { data: snapshot.data, setData: store.setData, storageError: snapshot.error, resumeSaving: store.resumeSaving, replacement: snapshot.replacement, getReplacement, flush: store.flush }
}
