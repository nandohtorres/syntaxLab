import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'
import Paper from '@mui/material/Paper'

export default function QuestionPrompt({ question }) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false)
  const [isNotesVisible, setIsNotesVisible] = useState(true)

  function handleToggleAnswerVisibility() {
    setIsAnswerVisible(previousVisibility => !previousVisibility)
  }

  function handleToggleNotesVisibility() {
    setIsNotesVisible(previousVisibility => !previousVisibility)
  }

  if (!question) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, px: 1 }}>
        Select a question from the list above to get started.
      </Typography>
    )
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        {question.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
        {question.prompt}
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={handleToggleAnswerVisibility}
        sx={{ mb: 1 }}
      >
        {isAnswerVisible ? 'Hide Answer' : 'Show Answer'}
      </Button>
      <Collapse in={isAnswerVisible}>
        <Paper variant="outlined" sx={{ p: 1.5, mt: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Answer
          </Typography>
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

      {question.languageNotes?.length > 0 && (
        <Box sx={{ mt: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={handleToggleNotesVisibility}
            sx={{ mb: 1 }}
          >
            {isNotesVisible ? 'Hide Language Notes' : 'Show Language Notes'}
          </Button>
          <Collapse in={isNotesVisible}>
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                borderColor: 'secondary.main',
                borderStyle: 'dashed',
                bgcolor: 'background.default',
              }}
            >
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
                <Box key={index} sx={{ mt: index === 0 ? 0.5 : 1.5 }}>
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
            </Paper>
          </Collapse>
        </Box>
      )}
    </Box>
  )
}
