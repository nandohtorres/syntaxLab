import { ThemeContextProvider } from '@/context/ThemeContext'
import { ProgressContextProvider } from '@/context/ProgressContext'
import MainPage from '@/pages/MainPage'

export default function App() {
  return (
    <ThemeContextProvider>
      <ProgressContextProvider>
        <MainPage />
      </ProgressContextProvider>
    </ThemeContextProvider>
  )
}
