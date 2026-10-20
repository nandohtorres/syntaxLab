import { writeFileSync } from 'node:fs'
import { topics, drills, levels } from '../interview/content.js'
import { corrections, references } from '../interview/sources.js'

const sourceLinks = ids => ids.map(id => `[${references[id][0]}](${references[id][1]})`).join(', ')
const provenance = `Source snapshots read on 2026-10-19; originals remain unchanged:

1. User-provided Google Docs download, \`C:\\Users\\ferna\\Downloads\\Paycom Interview.pdf\`, dated 2026-04-22, 21 pages. SHA-256: \`67f179d434fdef94c32e381e6b60642a8918af26ce6474cb82aa932735340d3b\`.
2. \`career/interview-prep/INTERVIEW_STUDY_GUIDE.md\`, the reusable derivative. SHA-256: \`554153eaa8cc318c7a08908b58121ce2b1a1fe747b7cce0ac6cb9f4b926ecef0\`.

The guide is a derivative of the PDF, not independent confirmation. Section/page references preserve provenance. This rewrite checks technical traps against primary documentation, labels added application/coaching exercises, omits private stories and company hiring claims, and keeps the required coding inventory at the original Blind 75. No historical COMPLETED marks are imported into progress.`

const content = [`# Interview cheat sheet and recall drills`, provenance,
  `Use this in order: understand a short note, say it in your own words, write a quick response without looking, then compare. The standalone app's **Interview prep** tab provides the same material and editor-based rapid drills. SQL/code snippets here are self-reviewed, not executed or AI-graded. Answers/progress are stored only in your browser; use export/import to move devices.`,
  `## How to practice\n\nAim for 20–60 seconds for a small recall rep; take longer for code or stories. Use rounds of ten. If a criterion is missing, mark Needs another rep and revisit it after other prompts. Self-rated independent recall is scheduled after 1/3/7/14 days; assisted recall returns after ten minutes. These are practice heuristics, not validated proficiency scores.`,
]
for (let level = 1; level <= levels.length; level++) {
  content.push(`## ${level}. ${levels[level - 1]}`)
  for (const topic of topics.filter(item => item.level === level)) {
    content.push(`### ${topic.title}\n\n${topic.notes.map(note => `- ${note}`).join('\n')}\n\nSource notes: ${topic.origin}.${topic.sources.length ? ` Technical references: ${sourceLinks(topic.sources)}.` : ' Coaching guidance; adapt to truthful personal facts.'}`)
  }
}
content.push(`## Drill quiz (${drills.length} reps)\n\nWrite one short answer before revealing the reference. Grade the reasoning against the criteria, not exact wording. Check a criterion only if your original answer already contained it. Any missing criterion means another rep. Personal-example prompts have a rubric rather than an invented model biography.`)
for (const [index, drill] of drills.entries()) {
  content.push(`### Rep ${index + 1}: ${drill.title}\n\n${drill.prompt}\n\n<details>\n<summary>Reference and self-check</summary>\n\n${drill.answer.includes('\n') ? '```text\n' + drill.answer + '\n```' : drill.answer}\n\n${drill.criteria.map(item => `- [ ] ${item}`).join('\n')}\n\n</details>`)
}
writeFileSync(new URL('../../../../docs/interview-prep-cheat-sheet.md', import.meta.url), content.join('\n\n') + '\n')
writeFileSync(new URL('../../../../docs/interview-prep-corrections.md', import.meta.url), [
  '# Interview notes: corrections and scope', provenance,
  'Company-specific claims and private example answers are intentionally not reproduced. This is a new reusable rewrite; it does not overwrite either source. References were checked on 2026-10-19. Java-specific claims use Java scope; database examples identify PostgreSQL rather than generalizing every vendor.',
  ...corrections.map(([title, origin, explanation, ids]) => `## ${title}\n\nSource: ${origin}.\n\n${explanation}${ids.length ? `\n\nVerification: ${sourceLinks(ids)}.` : title === 'Teams example' ? '\n\nVerification: source-text inspection; counts reproduced with Python Counter and sorting.' : '\n\nScope decision: preserve these as historical/private source context, rather than verified reusable facts.'}`),
  '## Coverage and additions\n\nAll reusable source topic groups appear in the cheat sheet: sorting/heaps; SQL and DBMS; OOP/SOLID; Agile/Scrum; Git; language/runtime distinctions; React/JSX/DOM/HTML/CSS; HTTP/REST/SOAP; collection/pattern reasoning; general networking/MVC; behavioral/team answers and interviewer questions. Added examples extend these notes into practice: NULL/counting traps, transaction/failure reasoning, per-resource authorization, a short architecture explanation and explicit self-check criteria. These additions are not claims that the original PDF covered them in depth.\n\nThe duplicate-count/team exercises train prerequisite reasoning; they do not add non-Blind-75 problems to Python Path. Sieve/Fibonacci and other source topics are explanatory refreshers. Full runnable coding practice remains in Python Path.',
].join('\n\n') + '\n')
console.log(`Generated study sheet: ${topics.length} topics, ${drills.length} drills; ${corrections.length} correction/scope entries.`)
