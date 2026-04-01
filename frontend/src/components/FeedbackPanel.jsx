import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'

export default function FeedbackPanel({ testRunResult, isRunning }) {
  if (isRunning) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Running tests...
        </Typography>
      </Box>
    )
  }

  if (!testRunResult) {
    return null
  }

  if (testRunResult.runtimeError) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">
          <Typography
            variant="caption"
            component="pre"
            sx={{ whiteSpace: 'pre-wrap', m: 0, fontFamily: 'monospace' }}
          >
            {testRunResult.runtimeError}
          </Typography>
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Stack spacing={0.5}>
        {testRunResult.results.map((result) => (
          <Alert key={result.message} severity={result.passed ? 'success' : 'error'} sx={{ py: 0.25 }}>
            <Typography variant="caption">{result.message}</Typography>
          </Alert>
        ))}
      </Stack>
      {testRunResult.passed && (
        <Typography
          variant="caption"
          color="success.main"
          sx={{ mt: 1, display: 'block', fontWeight: 600 }}
        >
          All tests passed!
        </Typography>
      )}
    </Box>
  )
}
