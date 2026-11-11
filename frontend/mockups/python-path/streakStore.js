import { useSyncExternalStore } from 'react'

// Consecutive first-try passes, shared by every mounted practice section and kept in this browser.
export const STREAK_STORAGE_KEY = 'synlab_first_try_streak_v1'

function readCount() {
  try {
    const count = JSON.parse(localStorage.getItem(STREAK_STORAGE_KEY) || '{}').count
    return Number.isInteger(count) && count > 0 ? count : 0
  } catch { return 0 }
}

let count = readCount()
const listeners = new Set()
const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener) }
const getSnapshot = () => count

function save(nextCount) {
  if (nextCount === count) return
  count = nextCount
  try { localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify({ count })) } catch { /* the streak still counts for this visit */ }
  listeners.forEach(listener => listener())
}

export const recordFirstTryPass = () => save(count + 1)
// A miss quietly starts the count over; there is no penalty beyond that.
export const resetStreak = () => save(0)
export const useFirstTryStreak = () => useSyncExternalStore(subscribe, getSnapshot)
