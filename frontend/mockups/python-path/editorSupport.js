export const mono = '"Cascadia Code", Consolas, monospace'
export const definePracticeTheme = api => {
  api.editor.defineTheme('synlab-practice', { base: 'vs-dark', inherit: true, rules: [{ token: 'comment', foreground: '879bb6', fontStyle: 'italic' }], colors: { 'editor.background': '#101722', 'editor.foreground': '#d7e3f3', 'editorLineNumber.foreground': '#879bb6', 'editorCursor.foreground': '#98e7c4', 'scrollbarSlider.background': '#526b6180', 'scrollbarSlider.hoverBackground': '#7c9e8ba0', 'scrollbarSlider.activeBackground': '#7c9e8bcc' } })
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
