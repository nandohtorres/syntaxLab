export const check = (label, code) => ({ label, code })
export const syntax = (label, ...anyOf) => ({ label, anyOf, message: `Use ${label.toLowerCase()} in this rep, then run again.` })

export function lesson({ id, unit, title, prompt, solution, tests, starter = '# Write your Python here\n', files, solutionFiles, hints, note, track = 'foundations', variant = 0, skillId = id, ...extra }) {
  return {
    id: variant ? `${id}-v${variant}` : id,
    skillId, variant, version: 1, track, unit, title, prompt,
    entry: 'main.py', initialFiles: files ?? { 'main.py': starter },
    solutionFiles: solutionFiles ?? { ...(files ?? {}), 'main.py': solution },
    checks: tests.map((value, index) => typeof value === 'string' ? check(`Check ${index + 1}`, value) : value),
    hints: hints ?? ['Break the task into its input, operation and result.', 'Write the smallest version first. Inspect the feedback after running.'],
    note: note ?? 'Use the lesson hints to learn a construct; then try a fresh variation without looking.',
    takeaway: 'Your code passed. Try to explain why it works before the next rep.',
    ...extra,
  }
}
