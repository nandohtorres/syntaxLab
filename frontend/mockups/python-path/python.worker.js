/* global self */
import runnerSource from './runner.py?raw'
import sharedSetup from './content/structures.py?raw'
const base = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
let grade

async function initialize() {
  const { loadPyodide } = await import(/* @vite-ignore */ `${base}pyodide.mjs`)
  const python = await loadPyodide({ indexURL: base })
  grade = python.runPython(runnerSource + '\ngrade_request')
  self.postMessage({ type: 'ready' })
}
initialize().catch(() => self.postMessage({ type: 'load-error' }))
self.onmessage = ({ data }) => {
  if (data.type !== 'run' || !grade) return
  try {
    const result = grade(JSON.stringify({ exercise: data.exercise, files: data.files, sharedSetup }))
    self.postMessage({ type: 'result', id: data.id, result: JSON.parse(result) })
  } catch {
    self.postMessage({ type: 'run-error', id: data.id })
  }
}
