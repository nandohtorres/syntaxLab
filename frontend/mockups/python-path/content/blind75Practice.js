import { lessons } from './index.js'
import { slidingWindowSample as previousSample } from './slidingWindowSample.js'
import { lesson, check } from './lesson.js'
import { orderForLearning } from './learningPath.js'
import { problemTeaching } from './problemTeaching.js'
import { preparationDrills } from './preparationDrills.js'

export const blind75Questions = orderForLearning(lessons.filter(item => item.track === 'blind75').map(item => {
  const teaching = problemTeaching[item.problemId]
  if (!teaching) throw new Error(`Missing teaching review for ${item.problemId}`)
  const interfaceNote = item.unit === 'P07' || item.problemId === 23
    ? 'Lists illustrate the chains. Checks supply ListNode(val=0, next=None) objects.'
    : item.unit === 'P09' ? 'Lists illustrate trees in level order; null marks a missing child. Checks supply TreeNode(val=0, left=None, right=None) objects.'
    : item.problemId === 133 ? 'The example uses adjacency lists. Checks supply Node(val, neighbors) graph objects.' : undefined
  return { ...item, checkpointAnswer: teaching.why, originalProblem: {
    statement: item.prompt, example: teaching.example, source: item.url, adapted: true, interfaceNote,
  } }
}))
const target = blind75Questions.find(item => item.problemId === 3)
export const originalSlidingWindowProblem = {
  statement: 'Given a string s, find the length of the longest substring without duplicate characters.',
  example: { input: '"abcabcbb"', output: '3', explanation: 'The contiguous segment "abc" has length 3 and contains no repeated character.' },
  constraints: 'The string can be empty or contain up to 100,000 characters, including letters, numbers, symbols and spaces.',
  source: target.url,
}
const combined = previousSample.find(item => item.id === 'sw-longest-unique')
// Keep the final worked answer consistent with the count/shrink steps just learned.
const fullSolution = 'class Solution:\n    def lengthOfLongestSubstring(self, s):\n' + combined.solutionFiles['main.py'].split('\n').slice(1).map(line => '    ' + line.replace(/\btext\b/g, 's')).join('\n')
const countStep = lesson({
  id: 'sw-count-character', track: 'patterns', unit: 'P06', title: 'Add the incoming character',
  prompt: 'Write add_character(counts, char). Increase the count for char in place. A new character starts at one.',
  starter: 'def add_character(counts, char):\n    pass\n',
  solution: 'def add_character(counts, char):\n    counts[char] = counts.get(char, 0) + 1\n',
  tests: [check('New character', 'counts = {}\nadd_character(counts, "a")\nassert counts == {"a": 1}'), check('Repeated character', 'counts = {"a": 1}\nadd_character(counts, "a")\nassert counts == {"a": 2}'), check('Preserve other characters', 'counts = {"b": 2}\nadd_character(counts, "a")\nassert counts == {"a": 1, "b": 2}')],
  hints: ['Use counts.get(char, 0) to handle a new key.', 'Assign the old count plus one back to counts[char].'],
  checkpoint: 'Why count characters instead of only recording whether they are present?',
  checkpointAnswer: 'Counts tell us when adding a character creates a duplicate and when removing an occurrence makes the window valid again.',
  note: 'The right pointer grows the window by one character.',
})
const stages = [
  countStep,
  { ...previousSample.find(item => item.id === 'sw-shrink'), title: 'Remove the duplicate' },
  { ...combined, title: 'Combine the window logic' },
  { ...target, title: 'Solve the full problem', solutionFiles: { 'main.py': fullSolution }, note: '', checkpoint: 'Why is the nested shrinking loop still linear overall?', checkpointAnswer: 'Neither pointer moves backward. Each character enters and leaves the window at most once, giving O(n) pointer moves under ordinary constant-time dictionary operations.' },
]
const stageFeedback = [
  'Counts updated. Next, remove duplicates as the window grows.',
  'Window restored. Next, combine expansion and shrinking.',
  'Window logic complete. Next, use it in the LeetCode method.',
  'Checks passed. You completed this problem\'s practice sequence.',
]
export const slidingWindowSteps = stages.map((item, index) => ({ ...item,
  sample: true, libraryId: target.id, problemId: 3, url: target.url,
  questionNumber: 3, questionTitle: target.title, stage: 'Sliding Window',
  stepLetter: String.fromCharCode(97 + index), title: `${String.fromCharCode(97 + index)}. ${item.title.replace(/^[a-z]\. /, '')}`,
  takeaway: stageFeedback[index],
  originalProblem: originalSlidingWindowProblem,
}))
const preparations = new Map([...lessons.filter(item => item.track === 'patterns'), ...preparationDrills].map(item => [item.id, item]))
export const questionSteps = new Map(blind75Questions.map(question => {
  if (question.problemId === 3) return [3, slidingWindowSteps]
  const warmups = problemTeaching[question.problemId].preparations.map((id, index) => {
    const base = preparations.get(id)
    if (!base) throw new Error(`Unknown preparation ${id} for ${question.problemId}`)
    const scopedId = `${question.id}--${base.id}`
    return { ...base, id: scopedId, skillId: scopedId, unit: question.unit, guided: true,
      problemId: question.problemId, libraryId: question.id, questionTitle: question.title,
      url: question.url, originalProblem: question.originalProblem,
      title: `${String.fromCharCode(97 + index)}. Warm-up: ${base.title.replace(/\.$/, '')}`,
      stepLetter: String.fromCharCode(97 + index),
      checkpointAnswer: base.checkpointAnswer ?? `This warm-up practices a reusable operation. For ${question.title}: ${problemTeaching[question.problemId].why}`,
      takeaway: 'Warm-up checks passed. Continue to the next part; the full problem earns question credit.',
    }
  })
  const final = { ...question, guided: true, libraryId: question.id, questionTitle: question.title,
    title: `${String.fromCharCode(97 + warmups.length)}. Solve the full problem`, stepLetter: String.fromCharCode(97 + warmups.length),
    takeaway: 'Full-problem checks passed. This question is now marked practiced.',
  }
  return [question.problemId, [...warmups, final]]
}))
export const stepsForQuestion = id => questionSteps.get(id) ?? []
// Exactly 75 library entries; warm-ups and full tasks remain inside each entry.
export const leetCodePracticeLessons = blind75Questions.flatMap(item => stepsForQuestion(item.problemId))
