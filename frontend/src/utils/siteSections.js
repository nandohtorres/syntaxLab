export const siteSections = [
  { id: 'python', label: 'Python Basics' },
  { id: 'practice', label: 'LeetCode Patterns' },
  { id: 'learn', label: 'Learning Hub' },
]

export function sectionFromHash(hash) {
  const id = hash.replace(/^#/, '')
  if (id === 'interview') return 'learn'
  return siteSections.some(section => section.id === id) ? id : 'practice'
}
