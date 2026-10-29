import { blankProgress, normalizeBackup, STORAGE_KEY } from './progress.js'

// One owner for the old storage key: two mounted learning sections must not
// overwrite each other's drafts or attempt records with stale component state.
export function createPracticeStore(storage, lessons) {
  let snapshot
  let timer
  const listeners = new Set()
  const notify = () => listeners.forEach(listener => listener())
  function preserveSelection(data) {
    const selected = lessons.find(item => item.id === data.selectedId)
    if (!selected) return data
    const scope = isAlgorithmLesson(selected) ? 'algorithms' : 'basics'
    return data.selections?.[scope] ? data : { ...data, selections: { ...data.selections, [scope]: selected.id } }
  }
  function getSnapshot() {
    if (!snapshot) {
      const empty = { version: 1, kind: 'python-path', progress: blankProgress(), drafts: {}, notes: {}, selectedId: lessons[0].id, selections: {} }
      try {
        const raw = storage().getItem(STORAGE_KEY)
        snapshot = { data: raw ? normalizeBackup(JSON.parse(raw), lessons) : empty, error: '', saving: true, replacement: 0 }
        snapshot.data = preserveSelection(snapshot.data)
      } catch {
        snapshot = { data: empty, error: 'Saved practice data could not be read. Saving is paused; existing browser data has been left untouched.', saving: false, replacement: 0 }
      }
    }
    return snapshot
  }
  function flush() {
    clearTimeout(timer)
    const current = getSnapshot()
    if (!current.saving) return
    try { storage().setItem(STORAGE_KEY, JSON.stringify(current.data)) }
    catch {
      snapshot = { ...current, error: 'Browser storage is full or unavailable. Your current work is in memory and may be lost when this page closes.', saving: false }
      notify()
    }
  }
  function setData(update) {
    const current = getSnapshot()
    snapshot = { ...current, data: preserveSelection(typeof update === 'function' ? update(current.data) : update), replacement: current.replacement + (typeof update === 'function' ? 0 : 1) }
    notify()
    clearTimeout(timer)
    if (snapshot.saving) timer = setTimeout(flush, 350)
  }
  function resumeSaving() {
    snapshot = { ...getSnapshot(), saving: true, error: '' }
    flush()
    notify()
  }
  return {
    getSnapshot, setData, resumeSaving, flush,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener) },
  }
}

const interviewSyntax = new Set(['counter-tool', 'deque', 'heap', 'solution-method', 'node', 'recursive-sum', 'memo'])
export const isAlgorithmLesson = item => ['patterns', 'blind75'].includes(item.track) || item.unit === 'F13' || interviewSyntax.has(item.id)
export function lessonsForScope(lessons, scope) {
  const selected = lessons.filter(item => scope === 'all' || (scope === 'basics' ? !isAlgorithmLesson(item) : isAlgorithmLesson(item)))
  if (scope === 'algorithms') {
    const rank = { patterns: 0, foundations: 1, blind75: 2 }
    selected.sort((left, right) => rank[left.track] - rank[right.track])
  }
  return selected
}
export function selectedForScope(data, lessons, scope) {
  return lessons.find(item => item.id === data.selections?.[scope]) ?? lessons.find(item => item.id === data.selectedId) ?? lessons[0]
}
