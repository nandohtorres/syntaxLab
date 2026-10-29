import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { tracks } from './content/catalog.js'

export default function PathSidebar({ lessons, progress, exercise, choose, browse, busy, scope }) {
  return <Box sx={{ p: 2.5, width: 250 }}>
    <Typography sx={{ fontSize: 11, letterSpacing: 2, color: 'text.secondary', mb: 2 }}>THE PATH AHEAD</Typography>
    <Stack spacing={1}>
      {tracks.filter(track => lessons.some(item => item.track === track.id)).map(track => {
        const pool = lessons.filter(item => item.track === track.id)
        return <Box key={track.id}>
          <Button disabled={busy} fullWidth onClick={() => choose(pool.find(item => !progress.records[item.id]?.successes) ?? pool[0])} sx={{ justifyContent: 'space-between', color: exercise.track === track.id ? 'primary.main' : 'text.secondary' }}>
            {scope === 'algorithms' && track.id === 'foundations' ? 'Python for problems' : track.title}<Typography component="span" sx={{ fontSize: 11 }}>{pool.filter(item => progress.records[item.id]?.successes).length}/{pool.length}</Typography>
          </Button>
          {exercise.track === track.id && <Stack sx={{ pl: 1, maxHeight: 360, overflow: 'auto' }}>{track.units.map(unit => {
            const items = pool.filter(item => item.unit === unit.id)
            if (!items.length) return null
            return <Button key={unit.id} size="small" disabled={busy} aria-current={exercise.unit === unit.id ? 'step' : undefined} onClick={() => choose(items.find(item => !progress.records[item.id]?.successes) ?? items[0])} sx={{ justifyContent: 'flex-start', color: exercise.unit === unit.id ? 'primary.main' : 'text.secondary', textAlign: 'left', fontSize: 11 }}>{unit.id} · {scope === 'basics' && unit.id === 'F12' ? 'Useful Python syntax' : unit.title ?? unit.name}</Button>
          })}</Stack>}
        </Box>
      })}
      <Button disabled={busy} onClick={browse}>Browse all exercises</Button>
    </Stack>
    <Typography sx={{ mt: 4, fontSize: 12, lineHeight: 1.9, color: 'text.secondary' }}>A little code.<br />Another rep.<br />More confidence.</Typography>
  </Box>
}
