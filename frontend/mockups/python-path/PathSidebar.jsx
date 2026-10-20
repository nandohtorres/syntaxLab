import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { tracks } from './content/catalog.js'

export default function PathSidebar({ lessons, progress, exercise, choose, review, due, browse, busy }) {
  return <Box sx={{ p: 2.5, width: 250 }}>
    <Typography sx={{ fontSize: 11, letterSpacing: 2, color: 'text.secondary', mb: 2 }}>THE PATH AHEAD</Typography>
    <Stack spacing={1}>
      {tracks.map(track => {
        const pool = lessons.filter(item => item.track === track.id)
        return <Box key={track.id}>
          <Button disabled={busy} fullWidth onClick={() => choose(pool.find(item => !progress.records[item.id]?.successes) ?? pool[0])} sx={{ justifyContent: 'space-between', color: exercise.track === track.id ? 'primary.main' : 'text.secondary' }}>
            {track.title}<Typography component="span" sx={{ fontSize: 11 }}>{pool.filter(item => progress.records[item.id]?.successes).length}/{pool.length}</Typography>
          </Button>
          {exercise.track === track.id && <Stack sx={{ pl: 1, maxHeight: 360, overflow: 'auto' }}>{track.units.map(unit => {
            const items = pool.filter(item => item.unit === unit.id)
            if (!items.length) return null
            return <Button key={unit.id} size="small" disabled={busy} aria-current={exercise.unit === unit.id ? 'step' : undefined} onClick={() => choose(items.find(item => !progress.records[item.id]?.successes) ?? items[0])} sx={{ justifyContent: 'flex-start', color: exercise.unit === unit.id ? 'primary.main' : 'text.secondary', textAlign: 'left', fontSize: 11 }}>{unit.id} · {unit.title ?? unit.name}</Button>
          })}</Stack>}
        </Box>
      })}
      <Button disabled={busy} onClick={review} variant="outlined">Due review · {due}</Button>
      <Button disabled={busy} onClick={browse}>Browse all exercises</Button>
    </Stack>
    <Typography sx={{ mt: 4, fontSize: 12, lineHeight: 1.9, color: 'text.secondary' }}>A little code.<br />Another rep.<br />More confidence.</Typography>
  </Box>
}
