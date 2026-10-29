export const islandColor = theme => theme.palette.mode === 'dark' ? '#0e1520' : '#f9fcfa'

export const folderPanelStyle = () => ({
  position: 'relative', zIndex: 0, border: 0, bgcolor: 'transparent',
  p: 0, pt: 1.5, minWidth: 0,
})

export const folderTabStyle = theme => {
  const dark = theme.palette.mode === 'dark'
  const surface = islandColor(theme)
  return {
    position: 'relative', overflow: 'visible', minWidth: 0, minHeight: 48, px: 1,
    mt: 0.5, borderRadius: '12px 12px 0 0', border: 0, color: 'text.secondary', textTransform: 'none',
    fontSize: { xs: 11, sm: 13 }, fontWeight: 650,
    background: dark ? 'linear-gradient(135deg, #00000024, #00000012)' : 'linear-gradient(135deg, #e8f0ebc7, #cfdfd580)',
    backdropFilter: 'blur(10px)', boxShadow: dark ? 'inset 0 1px #ffffff0a' : 'inset 0 1px #ffffff99',
    transition: 'background-color 160ms ease, color 160ms ease',
    '&:hover': { bgcolor: dark ? '#ffffff0a' : '#ffffff88', color: 'primary.main' },
    '&.Mui-selected': {
      color: 'primary.main', fontWeight: 750, zIndex: 2,
      background: `linear-gradient(180deg, ${dark ? '#17271f' : '#e3ede6'}, ${surface} 95%)`,
      boxShadow: dark ? 'inset 0 1px #ffffff12, 0 -3px 12px #00000020' : 'inset 0 1px #ffffff, 0 -3px 12px #24493809',
      '&::after': { content: '""', position: 'absolute', height: 3, bottom: -2, left: 0, right: 0, bgcolor: surface },
    },
    '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -4 },
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  }
}
