import { lesson, check } from './lesson.js'
import { problemIndex } from './catalog.js'

export const cases = (method, rows) => rows.map(([args, expected], index) => check(
  `Case ${index+1}`, `_expect(Solution().${method}(${args}), ${expected})`,
))

export function problem(id, method, args, prompt, body, tests, extra={}) {
  const metadata = problemIndex.find(row => row.id === id)
  if (!metadata) throw new Error(`Problem ${id} is outside the fixed inventory`)
  return lesson({
    id:`b75-${id}`, skillId:`b75-${id}`, unit:metadata.module_id, track:'blind75',
    title:metadata.title, prompt, structures:true,
    starter:`class Solution:\n    def ${method}(self${args ? ', '+args : ''}):\n        # Write your solution here\n        pass\n`,
    solution:`class Solution:\n    def ${method}(self${args ? ', '+args : ''}):\n${body.split('\n').map(line=>'        '+line).join('\n')}\n`,
    tests, problemId:id, url:metadata.url,
    hints:[metadata.preparation_drill,'State what your loop, recursion or DP state represents. Test the smallest boundary before the ordinary case.'],
    note:`Start with this building block: ${metadata.preparation_drill}. These checks verify behavior on authored fixtures; passing is not proof of optimal complexity. Explain time and space separately.`,
    ...extra,
  })
}
