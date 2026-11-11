import { patternGuide } from '../content/patternGuide.js'
import { pythonTopics } from './pythonGuide.js'

// "See worked example" links from a practice task to the Learning Hub topic that teaches it.
const BASICS_UNIT_TOPICS = {
  F01: 'variables', F02: 'types', F03: 'numbers', F04: 'strings', F05: 'conditions', F06: 'for-loops', F07: 'lists',
  F08: 'functions', F09: 'classes', F10: 'imports', F11: 'exceptions', F12: 'collections', F13: 'recursion',
}
const OPEN_EVENT = 'synlab-open-hub'
let pendingRequest = null

// Returns { topic } or { pattern } when a mapping exists, otherwise null (no link is shown).
export function hubTargetFor(exercise) {
  if (patternGuide[exercise.unit]) return { pattern: exercise.unit, label: patternGuide[exercise.unit][0] }
  const topic = pythonTopics.find(item => item.id === BASICS_UNIT_TOPICS[exercise.unit])
  return topic ? { topic: topic.id, label: topic.title } : null
}

// The hub may not be mounted yet (sections load lazily), so the request also waits here until it opens.
export function openHubTarget(target) {
  pendingRequest = target
  globalThis.dispatchEvent(new CustomEvent(OPEN_EVENT))
  location.hash = 'learn'
}

export function takeHubRequest() {
  const request = pendingRequest
  pendingRequest = null
  return request
}

export function onHubRequest(listener) {
  globalThis.addEventListener(OPEN_EVENT, listener)
  return () => globalThis.removeEventListener(OPEN_EVENT, listener)
}
