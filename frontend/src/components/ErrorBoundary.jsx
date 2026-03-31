import { Component } from 'react'
import * as Sentry from '@sentry/react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { contexts: { react: errorInfo } })
  }

  handleReset() {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ padding: '2rem', textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Something went wrong.</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            An unexpected error occurred. You can try again or refresh the page.
          </Typography>
          <Button variant="contained" onClick={() => this.handleReset()}>
            Try again
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}
