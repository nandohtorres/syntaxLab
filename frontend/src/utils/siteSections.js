export const siteSections = [
  { id: 'practice', label: 'Original practice' },
  { id: 'python', label: 'Python Path' },
  { id: 'interview', label: 'Interview prep' },
]

export function sectionFromHash(hash) {
  const id = hash.replace(/^#/, '')
  return siteSections.some(section => section.id === id) ? id : 'practice'
}
