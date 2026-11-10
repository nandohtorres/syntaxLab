import { Box, ButtonBase } from '@mui/material'
import { mono } from './editorSupport.js'

// Symbols phone keyboards hide behind extra taps; Tab inserts four spaces like the editor's indent.
const KEYS = [
  { label: 'Tab', text: '    ' }, { label: ':' }, { label: '(' }, { label: ')' }, { label: '[' }, { label: ']' },
  { label: '=' }, { label: ',' }, { label: '.' }, { label: '"' }, { label: "'" }, { label: '_' },
  { label: '+' }, { label: '-' }, { label: '*' }, { label: '<' }, { label: '>' }, { label: '{' }, { label: '}' }, { label: '#' },
]

export default function SymbolKeys({ onInsert }) {
  return <Box role="toolbar" aria-label="Code symbols" sx={{ display: 'flex', gap: 0.75, px: 1, py: 0.75, overflowX: 'auto', flexShrink: 0, scrollbarWidth: 'none', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
    {KEYS.map(({ label, text = label }) => <ButtonBase key={label} aria-label={label === 'Tab' ? 'Insert indent' : `Insert ${label}`}
      // Keep focus (and the phone keyboard) in the editor while tapping a symbol.
      onPointerDown={event => event.preventDefault()} onClick={() => onInsert(text)}
      sx={{ flexShrink: 0, minWidth: label === 'Tab' ? 52 : 38, height: 38, px: 1, borderRadius: 1.5, bgcolor: 'action.hover', fontFamily: mono, fontSize: 16, fontWeight: 600, color: 'text.primary' }}>
      {label}
    </ButtonBase>)}
  </Box>
}
