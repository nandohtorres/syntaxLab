import { blankProgress, normalizeBackup, recordAttempt } from '../progress.js'
import { drills } from './content.js'
export const KEY = 'synlab_interview_recall_v1'
export const exercises = drills.map(drill => ({ ...drill, skillId: drill.topicId, version: 1, entry: 'answer.txt' }))
export const blankRecall = () => ({ version: 1, kind: 'interview-recall', selectedId: drills[0].id, progress: blankProgress(), drafts: {}, notes: {} })
export const restoreRecall = value => {
  if (value?.kind !== 'interview-recall') throw new Error('Choose an Interview Recall backup, not a Python Path backup.')
  return normalizeBackup(value, exercises, 'interview-recall')
}

export function rateRecall(state, drill, { id, answer, remembered, helped }, now = Date.now()) {
  if (!answer.trim()) throw new Error('Write an answer before checking your recall.')
  return {
    ...state,
    drafts: { ...state.drafts, [drill.id]: { 'answer.txt': answer.slice(0, 15000) } },
    progress: recordAttempt(state.progress, { ...drill, skillId: drill.topicId, version: 1 }, { id, passed: remembered, assisted: helped }, now),
  }
}
