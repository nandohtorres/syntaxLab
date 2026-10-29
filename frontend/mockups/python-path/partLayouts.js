export const partLayouts = [
  { id: 'guided', label: '1. Guided dropdown' },
  { id: 'outline', label: '2. Outline dropdown' },
  { id: 'accordion', label: '3. Expandable parts' },
]
export function partLayoutFromSearch(search) {
  const value = new URLSearchParams(search).get('parts')
  return partLayouts.some(item => item.id === value) ? value : 'outline'
}
