import { activeDarkTheme as darkPreview } from '../../src/utils/darkPreview.js'

export const mono = '"Cascadia Code", Consolas, monospace'
// Inline code chip shared by task sentences (Rapid Fire and practice), so code never reads as English.
export const codeChip = { fontFamily: mono, fontSize: '0.88em', px: 0.6, py: 0.1, borderRadius: 1, whiteSpace: 'pre-wrap' }

// One palette for every editor theme, so Monaco and CodeSurface (ADR 0001) can't drift apart.
export const editorPalette = {
  dark: {
    background: darkPreview.editor, foreground: darkPreview.text.primary, gutter: darkPreview.text.secondary,
    cursor: darkPreview.primary, selection: '#b0c1d82b', activeLine: '#ffffff05', indentGuide: '#404040', activeIndentGuide: '#707070',
    comment: darkPreview.syntax?.comment ?? '#b8c4d3', keyword: darkPreview.syntax?.keyword ?? darkPreview.primary,
    string: darkPreview.syntax?.string ?? '#ebc6a5', number: darkPreview.syntax?.number ?? '#bddbaf', type: darkPreview.syntax?.type ?? '#b0d7d5',
  },
  light: {
    background: '#ffffff', foreground: '#172b3a', gutter: '#637586', cursor: '#24684f', selection: '#add6ff', activeLine: '#00000006', indentGuide: '#d3d3d3', activeIndentGuide: '#939393',
    comment: '#526b59', keyword: '#0000ff', string: '#a31515', number: '#098658', type: '#267f99',
  },
}
const hex = color => color.slice(1)
export const definePracticeTheme = api => {
  const dark = editorPalette.dark
  api.editor.defineTheme('synlab-practice', {
    base: 'vs-dark', inherit: true,
    rules: [
      { token: 'comment', foreground: hex(dark.comment), fontStyle: 'italic' },
      { token: 'keyword', foreground: hex(dark.keyword) },
      { token: 'string', foreground: hex(dark.string) },
      { token: 'number', foreground: hex(dark.number) },
      { token: 'type', foreground: hex(dark.type) },
    ],
    colors: {
      'editor.background': dark.background, 'editor.foreground': dark.foreground,
      'editorLineNumber.foreground': dark.gutter, 'editorCursor.foreground': dark.cursor,
      'scrollbarSlider.background': `${darkPreview.divider}80`, 'scrollbarSlider.hoverBackground': `${darkPreview.primary}80`,
      'scrollbarSlider.activeBackground': `${darkPreview.primary}aa`,
      ...(darkPreview.syntax ? {
      'editorBracketHighlight.foreground1': '#b0c1d8', 'editorBracketHighlight.foreground2': '#c5b8ce',
      'editorBracketHighlight.foreground3': '#b4c4b3', 'editorBracketHighlight.foreground4': '#cfbfaa',
      'editorBracketHighlight.foreground5': '#b2c1cd', 'editorBracketHighlight.foreground6': '#bfc1d1',
      'editorBracketMatch.background': '#b0c1d81a', 'editorBracketMatch.border': '#718398',
      'editor.selectionBackground': dark.selection, 'editor.lineHighlightBackground': dark.activeLine,
      'editor.lineHighlightBorder': '#00000000',
      } : {}),
    },
  })
  const light = editorPalette.light
  api.editor.defineTheme('synlab-practice-light', { base: 'vs', inherit: true, rules: [{ token: 'comment', foreground: hex(light.comment), fontStyle: 'italic' }], colors: { 'editor.background': light.background, 'editor.foreground': light.foreground, 'editorLineNumber.foreground': light.gutter, 'editorCursor.foreground': light.cursor, 'scrollbarSlider.background': '#a3b8ac80', 'scrollbarSlider.hoverBackground': '#6e9180a0', 'scrollbarSlider.activeBackground': '#6e9180cc' } })
}

export function download(name, text, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = name.split('/').pop()
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
