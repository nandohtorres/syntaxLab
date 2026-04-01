import { useState, useEffect } from 'react'

const QUESTIONS_API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/questions`

export function useQuestions() {
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    async function fetchQuestionsFromApi() {
      try {
        const response = await fetch(QUESTIONS_API_URL)

        if (!response.ok) {
          throw new Error(`Failed to fetch questions — server responded with status ${response.status}`)
        }

        const questionsData = await response.json()
        const questionsSortedByOrder = [...questionsData].sort((a, b) => a.order - b.order)
        setQuestions(questionsSortedByOrder)
      } catch (error) {
        setFetchError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestionsFromApi()
  }, [])

  return { questions, isLoading, fetchError }
}
