// Capabilities follow authored requirements, never leftover learner files.
export function exerciseFileTools(exercise) {
  const initial = Object.keys(exercise.initialFiles)
  const required = Object.keys(exercise.solutionFiles)
  const createsFiles = required.some(name => !initial.includes(name))
  return {
    add: exercise.allowExtraFiles ?? createsFiles,
    save: exercise.allowFileDownload ?? (initial.length > 1 || createsFiles),
  }
}
