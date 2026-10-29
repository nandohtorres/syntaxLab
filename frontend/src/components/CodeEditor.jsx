import Editor from '@monaco-editor/react'
import { useEffect, useRef } from 'react'
import '@practice/editorRuntime.js'
import { useThemeContext } from '@/context/ThemeContext'
import { useStudyLayout } from '@practice/layoutContext.js'

const EDITOR_LANGUAGE = 'python'
const DARK_EDITOR_THEME = 'synlab-practice-site'
const LIGHT_EDITOR_THEME = 'light'

const EDITOR_OPTIONS = {
  fontSize: 16,
  fontFamily: '"Cascadia Code", Consolas, monospace',
  lineHeight: 28,
  padding: { top: 24 },
  scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8, useShadows: false },
  ariaLabel: 'Python code editor',
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  tabSize: 4,
  automaticLayout: true,
  // Monaco #5294: matching-word requests can reject during model/tab changes.
  occurrencesHighlight: 'off',
  lineNumbersMinChars: 2,
  contextmenu: false,
}

export default function CodeEditor({ code, onCodeChange, onRun, onNext }) {
  const { themeMode } = useThemeContext()
  const layout = useStudyLayout()
  const runAction = useRef(onRun)
  const nextAction = useRef(onNext)
  useEffect(() => { runAction.current = onRun; nextAction.current = onNext }, [onRun, onNext])

  const editorTheme = layout !== 'current' || themeMode === 'dark' ? DARK_EDITOR_THEME : LIGHT_EDITOR_THEME

  return (
    <Editor
      height="100%"
      language={EDITOR_LANGUAGE}
      theme={editorTheme}
      beforeMount={api => api.editor.defineTheme(DARK_EDITOR_THEME, {
        base: 'vs-dark', inherit: true,
        rules: [{ token: 'comment', foreground: '64758c', fontStyle: 'italic' }],
        colors: {
          'editor.background': '#101722', 'editor.foreground': '#d7e3f3',
          'editorLineNumber.foreground': '#52657e', 'editorCursor.foreground': '#98e7c4',
          'scrollbarSlider.background': '#465e6380', 'scrollbarSlider.hoverBackground': '#98e7c480',
          'scrollbarSlider.activeBackground': '#98e7c4aa', 'scrollbar.shadow': '#00000000',
        },
      })}
      value={code}
      onChange={onCodeChange}
      options={EDITOR_OPTIONS}
      onMount={(editor, api) => { if (onRun) editor.addCommand(api.KeyMod.CtrlCmd | api.KeyCode.Enter, () => runAction.current?.(editor.getValue())); if (onNext) editor.addCommand(api.KeyMod.CtrlCmd | api.KeyMod.Shift | api.KeyCode.Enter, () => nextAction.current?.()); editor.focus() }}
    />
  )
}
