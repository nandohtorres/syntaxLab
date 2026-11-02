// Graphite is the normal dark palette; explicit queries retain comparison studies.
const previews = {
  graphite: {
    name: 'Graphite Slate', primary: '#b0c1d8',
    background: { default: '#1d2025', paper: '#30353d', island: '#272b31', glow: '#30363d', tabActive: '#343d49' },
    text: { primary: '#e3e7ec', secondary: '#aeb8c5' }, divider: '#4b535f', editor: '#252a31',
    tones: {
      info: { main: '#9db8cf' }, success: { main: '#9fbaa8' }, error: { main: '#d6a4a4' },
      warning: { main: '#d5b789', light: '#e6cdaa', dark: '#c5a778' },
    },
    syntax: { keyword: '#c1cbda', string: '#d3c1a6', number: '#b6c5a4', type: '#abbfc4', comment: '#9da8b7' },
  },
  'slate-blue': {
    name: 'Slate Blue', primary: '#abc9fb',
    background: { default: '#2c3542', paper: '#424e5f', island: '#354150', glow: '#465570', tabActive: '#4b5d7c' },
    text: { primary: '#f1f3f7', secondary: '#cbd3df' }, divider: '#6a778d', editor: '#354252',
  },
  'slate-lavender': {
    name: 'Slate Lavender', primary: '#d1c5f4',
    background: { default: '#343744', paper: '#4a4e60', island: '#414553', glow: '#5b566f', tabActive: '#605d7b' },
    text: { primary: '#f1eff7', secondary: '#d6d3e4' }, divider: '#7b7c94', editor: '#3f4454',
  },
  slate: {
    name: 'Soft Slate', primary: '#adddca', secondary: '#c5d2dc',
    background: { default: '#293745', paper: '#3c4d5d', island: '#344454', glow: '#405a60', tabActive: '#455d62' },
    text: { primary: '#eff3f6', secondary: '#cad4dd' }, divider: '#637482', editor: '#344453',
  },
  charcoal: {
    name: 'Warm Charcoal', primary: '#c0d9ad', secondary: '#d5d3c9',
    background: { default: '#353733', paper: '#4a4e46', island: '#41453e', glow: '#535d49', tabActive: '#58604c' },
    text: { primary: '#f3f0e8', secondary: '#d5d3c9' }, divider: '#747a6c', editor: '#3d423b',
  },
}
export const darkPreview = previews[new URLSearchParams(globalThis.location?.search ?? '').get('dark')]
export const activeDarkTheme = darkPreview ?? previews.graphite
export const previewPalette = {
  mode: 'dark', primary: { main: activeDarkTheme.primary, contrastText: '#273141' },
  secondary: { main: activeDarkTheme.primary }, background: activeDarkTheme.background,
  text: activeDarkTheme.text, divider: activeDarkTheme.divider,
  ...activeDarkTheme.tones,
}
