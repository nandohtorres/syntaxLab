import { createContext, useContext, useState, useCallback } from 'react'

const PROGRESS_STORAGE_KEY = 'synlab_progress'

const ProgressContext = createContext(null)

function loadProgressFromLocalStorage() {
  try {
    const storedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY)
    return storedProgress ? JSON.parse(storedProgress) : {}
  } catch {
    return {}
  }
}

export function ProgressContextProvider({ children }) {
  const [completedQuestions, setCompletedQuestions] = useState(loadProgressFromLocalStorage)

  const markQuestionAsComplete = useCallback((questionId) => {
    setCompletedQuestions(previousProgress => {
      const updatedProgress = { ...previousProgress, [questionId]: true }
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updatedProgress))
      return updatedProgress
    })
  }, [])

  const isQuestionComplete = useCallback((questionId) => {
    return Boolean(completedQuestions[questionId])
  }, [completedQuestions])

  return (
    <ProgressContext.Provider value={{ completedQuestions, markQuestionAsComplete, isQuestionComplete }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgressContext() {
  return useContext(ProgressContext)
}
