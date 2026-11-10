import { createContext, useContext } from 'react'

export const StudyLayoutContext = createContext('island')
export const useStudyLayout = () => useContext(StudyLayoutContext)
export const isSlidingWindowSample = search => new URLSearchParams(search).get('sample') === 'sliding-window'
export function layoutFromSearch(search) {
  if (isSlidingWindowSample(search)) return 'island'
  const layout = new URLSearchParams(search).get('layout')
  return ['island', 'flow'].includes(layout) ? layout : 'island'
}
// Scroll area inset from its panel's rounded corners so the scrollbar is never clipped.
export const insetScrollArea = { overflowY: 'auto', scrollbarGutter: 'stable', mr: 0.5, my: 0.75 }

// Phones and small tablets get the code drawer layout (ADR 0001, mobile code drawer plan).
export const PHONE_LAYOUT_QUERY = '(max-width: 899.95px)'
export const InCodeDrawerContext = createContext(false)
export const useInCodeDrawer = () => useContext(InCodeDrawerContext)
