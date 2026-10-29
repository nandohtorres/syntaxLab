import foundations from './foundations.js'
import patterns from './patterns.js'
import scripts from './scripts.js'
import sequences from './blind75-sequences.js'
import dynamic from './blind75-dynamic.js'
import graphs from './blind75-graphs-lists.js'
import trees from './blind75-trees.js'
import { problemIndex } from './catalog.js'
import { auditChecks } from './auditChecks.js'
import { check } from './lesson.js'

const problems = [...sequences, ...dynamic, ...graphs, ...trees]
for (const item of problems) {
  if (!auditChecks[item.problemId]) throw new Error(`Missing reviewed edge cases for ${item.problemId}`)
  item.checks.push(check('Reviewed edge cases', auditChecks[item.problemId]))
}
const order = new Map(problemIndex.map((problem,index) => [problem.id,index]))
problems.sort((a,b) => order.get(a.problemId)-order.get(b.problemId))
export const lessons = [...foundations, ...patterns, ...scripts, ...problems]
export const byId = new Map(lessons.map(exercise => [exercise.id,exercise]))
export const firstLesson = lessons[0]
export const stats = {
  foundations: foundations.length, patterns:patterns.length,
  scripts:scripts.length, blind75:problems.length,
}

if (byId.size !== lessons.length || problems.length !== 75 || new Set(problems.map(p => p.problemId)).size !== 75) {
  throw new Error('The authored lesson inventory contains duplicates or missing Blind 75 problems.')
}
