import Editor from '@monaco-editor/react'
import { useThemeContext } from '@/context/ThemeContext'

const EDITOR_LANGUAGE = 'python'
const DARK_EDITOR_THEME = 'vs-dark'
const LIGHT_EDITOR_THEME = 'light'

const EDITOR_OPTIONS = {
  fontSize: 16,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  tabSize: 4,
  automaticLayout: true,
  lineNumbersMinChars: 2,
}

export default function CodeEditor({ code, onCodeChange }) {
  const { themeMode } = useThemeContext()

  const editorTheme = themeMode === 'dark' ? DARK_EDITOR_THEME : LIGHT_EDITOR_THEME

  return (
    <Editor
      height="100%"
      language={EDITOR_LANGUAGE}
      theme={editorTheme}
      value={code}
      onChange={onCodeChange}
      options={EDITOR_OPTIONS}
    />
  )
}
