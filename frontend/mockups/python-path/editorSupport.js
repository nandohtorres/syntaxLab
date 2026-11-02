import { activeDarkTheme as darkPreview } from '../../src/utils/darkPreview.js'

export const mono = '"Cascadia Code", Consolas, monospace'
export const definePracticeTheme = api => {
  api.editor.defineTheme('synlab-practice', {
    base: 'vs-dark', inherit: true,
    rules: [
      { token: 'comment', foreground: darkPreview?.syntax?.comment.slice(1) ?? (darkPreview ? 'b8c4d3' : '879bb6'), fontStyle: 'italic' },
      ...(darkPreview ? [
        { token: 'keyword', foreground: (darkPreview.syntax?.keyword ?? darkPreview.primary).slice(1) },
        { token: 'string', foreground: darkPreview.syntax?.string.slice(1) ?? 'ebc6a5' },
        { token: 'number', foreground: darkPreview.syntax?.number.slice(1) ?? 'bddbaf' },
        { token: 'type', foreground: darkPreview.syntax?.type.slice(1) ?? 'b0d7d5' },
      ] : []),
    ],
    colors: {
      'editor.background': darkPreview?.editor ?? '#101722',
      'editor.foreground': darkPreview?.text.primary ?? '#d7e3f3',
      'editorLineNumber.foreground': darkPreview?.text.secondary ?? '#879bb6',
      'editorCursor.foreground': darkPreview?.primary ?? '#98e7c4',
      'scrollbarSlider.background': darkPreview ? `${darkPreview.divider}80` : '#526b6180',
      'scrollbarSlider.hoverBackground': darkPreview ? `${darkPreview.primary}80` : '#7c9e8ba0',
      'scrollbarSlider.activeBackground': darkPreview ? `${darkPreview.primary}aa` : '#7c9e8bcc',
      ...(darkPreview?.syntax ? {
        'editorBracketHighlight.foreground1': '#b0c1d8', 'editorBracketHighlight.foreground2': '#c5b8ce',
        'editorBracketHighlight.foreground3': '#b4c4b3', 'editorBracketHighlight.foreground4': '#cfbfaa',
        'editorBracketHighlight.foreground5': '#b2c1cd', 'editorBracketHighlight.foreground6': '#bfc1d1',
        'editorBracketMatch.background': '#b0c1d81a', 'editorBracketMatch.border': '#718398',
        'editor.selectionBackground': '#b0c1d82b', 'editor.lineHighlightBackground': '#ffffff05',
        'editor.lineHighlightBorder': '#00000000',
      } : {}),
    },
  })
  api.editor.defineTheme('synlab-practice-light', { base: 'vs', inherit: true, rules: [{ token: 'comment', foreground: '526b59', fontStyle: 'italic' }], colors: { 'editor.background': '#ffffff', 'editor.foreground': '#172b3a', 'editorLineNumber.foreground': '#637586', 'editorCursor.foreground': '#24684f', 'scrollbarSlider.background': '#a3b8ac80', 'scrollbarSlider.hoverBackground': '#6e9180a0', 'scrollbarSlider.activeBackground': '#6e9180cc' } })
}

export function download(name, text, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = name.split('/').pop()
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
