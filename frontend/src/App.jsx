import { ThemeContextProvider } from '@/context/ThemeContext'
import { ProgressContextProvider } from '@/context/ProgressContext'
import MainPage from '@/pages/MainPage'
import ErrorBoundary from '@/components/ErrorBoundary'

// TODO: remove after confirming Sentry works
function SentryTestButton() {
  return (
    <button onClick={() => { throw new Error('This is your first error!') }}>
      Break the world
    </button>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeContextProvider>
        <ProgressContextProvider>
          <SentryTestButton />
          <MainPage />
        </ProgressContextProvider>
      </ThemeContextProvider>
    </ErrorBoundary>
  )
}
