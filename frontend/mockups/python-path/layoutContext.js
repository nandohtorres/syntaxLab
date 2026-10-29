import { createContext, useContext } from 'react'

export const StudyLayoutContext = createContext('island')
export const useStudyLayout = () => useContext(StudyLayoutContext)
export const isSlidingWindowSample = search => new URLSearchParams(search).get('sample') === 'sliding-window'
export function layoutFromSearch(search) {
  if (isSlidingWindowSample(search)) return 'island'
  const layout = new URLSearchParams(search).get('layout')
  return ['island', 'flow'].includes(layout) ? layout : 'island'
}
