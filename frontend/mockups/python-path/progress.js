export const STORAGE_KEY = 'synlab_python_path_v1'
const DAY = 86400000
const object = value => value && typeof value === 'object' && !Array.isArray(value)
export const blankProgress = () => ({ version:1, attempts:[], records:{}, skills:{} })

export function recordAttempt(progress, exercise, attempt, now=Date.now()) {
  if (progress.attempts.some(item=>item.id===attempt.id)) return progress
  const prior = progress.records[exercise.id]
  const record = prior?.version===exercise.version ? prior : { version:exercise.version, successes:0, failures:0, independent:0 }
  const independent = attempt.passed && !attempt.assisted
  const successes = record.successes + (attempt.passed ? 1 : 0)
  const independentCount = record.independent + (independent ? 1 : 0)
  const intervals = [1,3,7,14]
  const delay = !attempt.passed ? 0 : attempt.assisted ? 600000 : intervals[Math.min(independentCount-1,3)]*DAY
  const previousSkill = progress.skills[exercise.skillId]
  const skill = previousSkill?.version===exercise.version ? previousSkill : { version:exercise.version, evidence:[] }
  const day = new Date(now).toISOString().slice(0,10)
  const key = `${exercise.id}:${day}`
  const evidence = independent && !skill.evidence.some(item=>item.key===key)
    ? [...skill.evidence,{ key, variant:exercise.id, day }].slice(-60) : skill.evidence
  return {
    version:1,
    attempts:[...progress.attempts,{ id:attempt.id, exerciseId:exercise.id, passed:!!attempt.passed, assisted:!!attempt.assisted, at:now }].slice(-2000),
    records:{...progress.records,[exercise.id]:{ version:exercise.version, successes, independent:independentCount, failures:record.failures+(!attempt.passed?1:0), dueAt:now+delay, lastAt:now, lastPassed:!!attempt.passed }},
    skills:{...progress.skills,[exercise.skillId]:{version:exercise.version,evidence}},
  }
}

export function skillStatus(progress, exercise, variantCount=1) {
  const evidence = progress.skills[exercise.skillId]?.version===exercise.version ? progress.skills[exercise.skillId].evidence : []
  const days = new Set(evidence.map(item=>item.day)).size
  const variants = new Set(evidence.map(item=>item.variant)).size
  const retained = variantCount>1 ? variants>=Math.min(3,variantCount) && days>=2 : days>=3
  if (retained) return 'Retained'
  if (progress.records[exercise.id]?.successes) return 'Practicing'
  return 'New'
}

export function dueLessons(lessons, progress, now=Date.now()) {
  return lessons.filter(exercise=>{
    const record=progress.records[exercise.id]
    return record && record.version===exercise.version && record.dueAt<=now
  }).sort((a,b)=>progress.records[a.id].dueAt-progress.records[b.id].dueAt)
}

export function pickNext(pool, currentId, progress, queued=[], turn=0) {
  if (!pool.length) return null
  const due=queued.find(item=>item.turn<=turn && pool.some(exercise=>exercise.skillId===item.skillId))
  if (due) {
    const alternatives=pool.filter(exercise=>exercise.skillId===due.skillId && exercise.id!==(due.fromId ?? currentId))
    return alternatives.find(exercise=>!progress.records[exercise.id]?.successes) ?? alternatives[0] ?? pool.find(exercise=>exercise.skillId===due.skillId)
  }
  const index=pool.findIndex(exercise=>exercise.id===currentId)
  const ordered=[...pool.slice(index+1),...pool.slice(0,index+1)]
  return ordered.find(exercise=>!progress.records[exercise.id]?.successes) ?? ordered.find(exercise=>exercise.id!==currentId) ?? pool[0]
}

export function validFilePath(name) {
  return typeof name==='string' && name.length<=120 && /^[A-Za-z0-9_./-]+$/.test(name)
    && name.split('/').every(part=>part && !['.','..','__proto__','constructor','prototype'].includes(part))
}

export function cleanFiles(files) {
  if (!object(files) || Object.keys(files).length>20) return null
  const entries=Object.entries(files)
  if (entries.some(([name,text])=>!validFilePath(name) || typeof text!=='string') || entries.reduce((sum,[,text])=>sum+text.length,0)>100000) return null
  return Object.fromEntries(entries)
}

export function normalizeBackup(value, lessons, kind = 'python-path') {
  if (!object(value) || value.version!==1 || !object(value.progress) || value.progress.version!==1) throw new Error('This is not a supported Python Path backup.')
  if (value.kind && value.kind !== kind) throw new Error('This backup belongs to a different practice section.')
  const known=new Map(lessons.map(exercise=>[exercise.id,exercise]))
  const progress=blankProgress()
  const number=x=>typeof x==='number' && Number.isFinite(x) && x>=0
  for (const [id,record] of Object.entries(value.progress.records ?? {})) {
    if (!known.has(id) || !object(record)) continue
    if (['version','successes','failures','independent','dueAt','lastAt'].every(key=>number(record[key]))) {
      progress.records[id]={version:record.version,successes:record.successes,failures:record.failures,independent:record.independent,dueAt:record.dueAt,lastAt:record.lastAt,lastPassed:record.lastPassed===true}
    }
  }
  const skills=new Set(lessons.map(exercise=>exercise.skillId))
  for (const [id,skill] of Object.entries(value.progress.skills ?? {})) {
    if (!skills.has(id) || !object(skill) || !number(skill.version) || !Array.isArray(skill.evidence)) continue
    const evidence=skill.evidence.filter(item=>object(item) && typeof item.key==='string' && known.has(item.variant) && known.get(item.variant).skillId===id && /^\d{4}-\d{2}-\d{2}$/.test(item.day)).slice(-60)
    progress.skills[id]={version:skill.version,evidence}
  }
  progress.attempts=(Array.isArray(value.progress.attempts)?value.progress.attempts:[]).filter(item=>object(item) && typeof item.id==='string' && known.has(item.exerciseId) && number(item.at)).slice(-2000).map(item=>({id:item.id,exerciseId:item.exerciseId,passed:item.passed===true,assisted:item.assisted===true,at:item.at}))
  const drafts={}
  for (const [id,files] of Object.entries(value.drafts ?? {})) {
    const cleaned=cleanFiles(files)
    if (known.has(id) && cleaned && Object.hasOwn(cleaned,known.get(id).entry)) drafts[id]=cleaned
  }
  const notes={}
  for (const [id,note] of Object.entries(value.notes ?? {})) {
    if (known.has(id) && typeof note==='string') notes[id]=note.slice(0,3000)
  }
  const selections = {}
  for (const scope of ['basics', 'algorithms', 'all', 'sliding-window']) {
    const selected = known.get(value.selections?.[scope])
    if (selected) selections[scope] = selected.id
  }
  return {version:1,kind,progress,drafts,notes,selections,selectedId:known.has(value.selectedId)?value.selectedId:lessons[0].id}
}

export function loadSaved(storage, lessons) {
  try {
    const raw=storage.getItem(STORAGE_KEY)
    return raw ? normalizeBackup(JSON.parse(raw),lessons) : null
  } catch { return null }
}
