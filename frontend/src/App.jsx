import { ThemeContextProvider } from '@/context/ThemeContext'
import { ProgressContextProvider } from '@/context/ProgressContext'
import SitePage from '@/pages/SitePage'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeContextProvider>
        <ProgressContextProvider>
          <SitePage />
        </ProgressContextProvider>
      </ThemeContextProvider>
    </ErrorBoundary>
  )
}
