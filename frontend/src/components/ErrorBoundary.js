import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Paper sx={{ p: 4, m: 2, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We encountered an error while rendering this component. Please try refreshing the page.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mr: 2 }}
          >
            Refresh Page
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
          >
            Try Again
          </Button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Box sx={{ mt: 3, textAlign: 'left' }}>
              <Typography variant="h6" gutterBottom>Error Details:</Typography>
              <Typography variant="body2" component="pre" sx={{ 
                overflow: 'auto', 
                bgcolor: 'grey.100', 
                p: 2, 
                borderRadius: 1,
                fontSize: '0.8rem'
              }}>
                {this.state.error.toString()}
              </Typography>
            </Box>
          )}
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
