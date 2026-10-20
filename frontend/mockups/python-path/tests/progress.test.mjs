import test from 'node:test'
import assert from 'node:assert/strict'
import { blankProgress, recordAttempt, skillStatus, dueLessons, pickNext, normalizeBackup, validFilePath } from '../progress.js'

const day=86400000, start=Date.UTC(2026,9,19)
const base={id:'a',skillId:'assign',version:1,entry:'main.py'}
const b={...base,id:'b'}, c={...base,id:'c'}
const success=(id,assisted=false)=>({id,passed:true,assisted})

test('one pass or repeated same-day runs do not certify retention',()=>{
  let p=blankProgress()
  for(let i=0;i<4;i++) p=recordAttempt(p,base,success(String(i)),start)
  assert.equal(skillStatus(p,base,3),'Practicing')
  assert.equal(p.skills.assign.evidence.length,1)
})
test('distinct variants and a later day are required',()=>{
  let p=blankProgress()
  for(const x of [base,b,c]) p=recordAttempt(p,x,success(x.id),start)
  assert.equal(skillStatus(p,base,3),'Practicing')
  p=recordAttempt(p,base,success('later'),start+day)
  assert.equal(skillStatus(p,base,3),'Retained')
})
test('assisted work is practice but not independent evidence',()=>{
  const p=recordAttempt(blankProgress(),base,success('hinted',true),start)
  assert.equal(p.records.a.successes,1)
  assert.equal(p.records.a.independent,0)
  assert.deepEqual(p.skills.assign.evidence,[])
  assert.equal(dueLessons([base],p,start).length,0)
  assert.equal(dueLessons([base],p,start+600000).length,1)
})
test('duplicate result is idempotent and failures are immediately due',()=>{
  const event={id:'run-1',passed:false}
  const p=recordAttempt(blankProgress(),base,event,start)
  assert.equal(recordAttempt(p,base,event,start),p)
  assert.equal(dueLessons([base],p,start).length,1)
})
test('a corrected skill returns after intervening reps as another variant',()=>{
  assert.equal(pickNext([base,b,c],'a',blankProgress(),[{skillId:'assign',turn:3}],3).id,'b')
  const p=recordAttempt(blankProgress(),b,success('already-practiced'),start)
  assert.equal(pickNext([base,b,c],'unrelated',p,[{skillId:'assign',fromId:'a',turn:3}],3).id,'c')
})
test('backup preserves drafts and rejects unsupported schemas and file traversal',()=>{
  const backup={version:1,progress:blankProgress(),drafts:{a:{'main.py':'retries=3'},b:{'../bad.py':'x=1'}},notes:{a:'why'},selectedId:'a'}
  const restored=normalizeBackup(backup,[base,b,c])
  assert.equal(restored.drafts.a['main.py'],'retries=3')
  assert.equal(restored.drafts.b,undefined)
  assert.equal(restored.notes.a,'why')
  assert.throws(()=>normalizeBackup({version:7},[base]))
  assert.equal(validFilePath('helpers.py'),true)
  assert.equal(validFilePath('/absolute.py'),false)
  assert.equal(validFilePath('a/../bad.py'),false)
})
