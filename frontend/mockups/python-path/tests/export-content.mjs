import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import { lessons, stats } from '../content/index.js'
import { tracks, problemIndex } from '../content/catalog.js'

assert.equal(stats.blind75,75)
assert.deepEqual(new Set(lessons.filter(x=>x.track==='blind75').map(x=>x.problemId)),new Set(problemIndex.map(x=>x.id)))
for (const exercise of lessons) {
  assert.ok(exercise.prompt && exercise.checks.length && exercise.solutionFiles[exercise.entry],exercise.id)
  assert.ok(tracks.find(track=>track.id===exercise.track).units.some(unit=>unit.id===exercise.unit),exercise.id)
}
const output=fileURLToPath(new URL('../.cache/',import.meta.url))
mkdirSync(output,{recursive:true})
writeFileSync(new URL('../.cache/lessons.json',import.meta.url),JSON.stringify(lessons))
console.log('Content inventory:',JSON.stringify(stats),'total:',lessons.length)
