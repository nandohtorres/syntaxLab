import { writeFileSync } from 'node:fs'
import { categories, referenceTopics, httpCodes } from '../interview/referenceSheet.js'
import { references } from '../interview/sources.js'

const content = ['# Software engineering interview reference', '', 'Generated from the same content as the reference-only site. No quiz is included.', '', '## HTTP quick lookup', '', '| Code | Meaning | Use |', '| --- | --- | --- |', ...httpCodes.map(row => `| ${row.join(' | ')} |`)]
for (const [id, title] of categories) {
  content.push('', `## ${title}`)
  for (const topic of referenceTopics.filter(item => item.category === id)) {
    content.push('', `### ${topic.title}`, '', topic.summary, '', '```text', topic.example, '```', '', ...topic.notes.map(note => `- ${note}`))
    if (topic.sources.length) content.push('', 'Sources: ' + topic.sources.map(source => `[${references[source][0]}](${references[source][1]})`).join(', '))
  }
}
writeFileSync(new URL('../../../../docs/interview-reference.md', import.meta.url), content.join('\n') + '\n')
console.log(`Generated printable reference: ${referenceTopics.length} topics`)
