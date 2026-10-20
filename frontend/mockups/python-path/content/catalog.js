import manifest from './curriculum.json' with { type: 'json' }

export const foundationUnits = manifest.foundation_units
export const patternModules = manifest.problem_modules
export const scriptProjects = manifest.script_projects
export const problemIndex = manifest.problems
export const tracks = [
  { id:'foundations', title:'Foundations', subtitle:'Learn to write Python', units:foundationUnits },
  { id:'patterns', title:'Building blocks', subtitle:'Small operations, repeated', units:patternModules },
  { id:'scripts', title:'Practical scripts', subtitle:'Use Python for ordinary work', units:scriptProjects },
  { id:'blind75', title:'Blind 75', subtitle:'The original 75, runnable here', units:patternModules },
]
