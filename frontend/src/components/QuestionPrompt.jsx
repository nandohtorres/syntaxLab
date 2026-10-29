import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'
import Paper from '@mui/material/Paper'
import { useStudyLayout } from '@practice/layoutContext.js'

export default function QuestionPrompt({ question }) {
  const layout = useStudyLayout()
  const demo = layout !== 'current'
  const [isAnswerVisible, setIsAnswerVisible] = useState(false)
  const [isNotesVisible, setIsNotesVisible] = useState(false)

  if (!question) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, px: 1.5 }}>
        Select a question from the list above to get started.
      </Typography>
    )
  }

  return (
    <Box sx={{ p: demo ? (layout === 'flow' ? 0 : 2) : { xs: 2, md: 2.5 } }}>
      <Typography sx={{ fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', fontWeight: 700, color: 'primary.main', mb: 1 }}>{question.group}</Typography>
      <Typography component="h2" id="exercise-title" sx={{ fontSize: 23, fontWeight: 650, letterSpacing: '-0.4px', mb: 1.5 }}>
        {question.title}
      </Typography>
      <Box
        sx={{
          border: demo ? '1px solid' : undefined,
          borderLeft: demo ? undefined : '3px solid',
          borderColor: demo ? 'divider' : 'primary.main',
          backgroundColor: demo ? 'background.paper' : theme => theme.palette.mode === 'dark' ? 'rgba(144,202,249,0.06)' : 'rgba(25,118,210,0.05)',
          borderRadius: demo ? 2 : '0 6px 6px 0',
          px: 1.5,
          py: 1,
          mb: 2,
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
          Your Task
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
          {question.prompt}
        </Typography>
      </Box>

      {/* Answer */}
      <Box sx={{ mt: 1 }}>
        <Button variant="outlined" size="small" aria-expanded={isAnswerVisible} onClick={() => setIsAnswerVisible(v => !v)}>
          {isAnswerVisible ? 'Hide Answer' : 'Show Answer'}
        </Button>
        <Collapse in={isAnswerVisible}>
          <Paper variant="outlined" sx={{ p: 1.5, mt: 0.5 }}>
            <Typography
              variant="body2"
              component="pre"
              sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', m: 0 }}
            >
              {question.answer}
            </Typography>
            {question.pythonicTip && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" color="primary.main" display="block">
                  Pythonic Tip: {question.pythonicTip}
                </Typography>
              </>
            )}
          </Paper>
        </Collapse>
      </Box>

      {/* Language Notes */}
      {question.languageNotes?.length > 0 && (
        <Box sx={{ mt: 1.5 }}>
          <Button variant="outlined" size="small" color="secondary" aria-expanded={isNotesVisible} onClick={() => setIsNotesVisible(v => !v)}>
            {isNotesVisible ? 'Hide Language Notes' : 'Show Language Notes'}
          </Button>
          <Collapse in={isNotesVisible}>
            <Paper variant="outlined" sx={{ mt: 0.5, borderColor: 'secondary.main', borderStyle: 'dashed' }}>
              <Box sx={{ p: 1.5, bgcolor: 'background.default' }}>
              {question.conceptSummary && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>
                    {question.conceptSummary.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.65, display: 'block' }}>
                    {question.conceptSummary.description}
                  </Typography>
                  <Divider sx={{ mt: 1.25, borderColor: 'secondary.main', opacity: 0.25 }} />
                </Box>
              )}
              <Typography variant="caption" color="secondary.main" fontWeight={700} display="block" gutterBottom>
                How other languages do this
              </Typography>
              {question.languageNotes.map((item, index) => (
                <Box key={item.language} sx={{ mt: index === 0 ? 0.5 : 1.5 }}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}
                  >
                    {item.language}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.65, display: 'block' }}>
                    {item.note}
                  </Typography>
                </Box>
              ))}
            </Box>
            </Paper>
          </Collapse>
        </Box>
      )}
    </Box>
  )
}
