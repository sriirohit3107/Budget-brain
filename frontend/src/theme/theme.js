import { createTheme } from '@mui/material';

// Apple-inspired theme with enhanced dark mode
export const createAppleTheme = (isDark) => createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
    primary: { 
      main: isDark ? '#0A84FF' : '#007AFF',
      light: isDark ? '#5AC8FA' : '#4DA3FF',
      dark: isDark ? '#0051D5' : '#0051D5'
    },
    secondary: { 
      main: isDark ? '#5E5CE6' : '#5856D6',
      light: isDark ? '#7B61FF' : '#7B61FF',
      dark: isDark ? '#3B39B3' : '#3B39B3'
    },
    background: {
      default: isDark ? '#1C1C1E' : '#F9FAFB',
      paper: isDark ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      secondary: isDark ? '#2C2C2E' : '#F3F4F6'
    },
    text: {
      primary: isDark ? '#F2F2F7' : '#1F2937',
      secondary: isDark ? '#AEAEB2' : '#6B7280',
      disabled: isDark ? '#636366' : '#9CA3AF'
    },
    divider: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    action: {
      hover: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
      selected: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
      active: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.12)'
    }
  },
  typography: {
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      color: isDark ? '#F2F2F7' : '#1F2937'
    },
    h2: {
      fontWeight: 700,
      color: isDark ? '#F2F2F7' : '#1F2937'
    },
    h3: {
      fontWeight: 600,
      color: isDark ? '#F2F2F7' : '#1F2937'
    },
    h4: {
      fontWeight: 600,
      color: isDark ? '#F2F2F7' : '#1F2937'
    },
    h5: {
      fontWeight: 600,
      color: isDark ? '#F2F2F7' : '#1F2937'
    },
    h6: {
      fontWeight: 600,
      color: isDark ? '#F2F2F7' : '#1F2937'
    },
    body1: {
      color: isDark ? '#F2F2F7' : '#1F2937'
    },
    body2: {
      color: isDark ? '#AEAEB2' : '#6B7280'
    }
  },
  shape: { 
    borderRadius: 16 
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: isDark ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          boxShadow: isDark 
            ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
            : '0 8px 32px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: isDark ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          boxShadow: isDark 
            ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
            : '0 8px 32px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
        }
      }
    }
  }
});
