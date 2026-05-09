import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#14b8a6',
    },
    background: {
      default: '#0b0f1a',
      paper: '#111827',
    },
    divider: '#1e2d47',
    text: {
      primary: '#f1f5f9',
      secondary: '#64748b',
    },
    success: { main: '#22c55e' },
    error: { main: '#ef4444' },
    warning: { main: '#f59e0b' },
  },
  typography: {
    fontFamily: "'Sora', 'Segoe UI', sans-serif",
    h5: { fontWeight: 700, letterSpacing: '-0.5px' },
    h6: { fontWeight: 600, letterSpacing: '-0.3px' },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600, fontFamily: "'Sora', sans-serif" },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#111827',
          border: '1px solid #1e2d47',
          boxShadow: '0 4px 32px #00000050',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#0d1422',
          borderBottom: '1px solid #1e2d47',
          boxShadow: 'none',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: '#0d1422',
          borderTop: '1px solid #1e2d47',
          height: 64,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#475569',
          '&.Mui-selected': {
            color: '#3b82f6',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.72rem',
            fontFamily: "'Sora', sans-serif",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: '0.9rem',
        },
        contained: {
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          boxShadow: '0 4px 16px #3b82f640',
          '&:hover': {
            background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
            boxShadow: '0 6px 20px #3b82f660',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            background: '#0b0f1a',
            '& fieldset': { borderColor: '#1e2d47' },
            '&:hover fieldset': { borderColor: '#334155' },
            '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
          },
          '& .MuiInputLabel-root': { color: '#64748b' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          background: '#0b0f1a',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1e2d47' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#111827',
          backgroundImage: 'none',
          border: '1px solid #1e2d47',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid',
        },
        standardSuccess: {
          borderColor: '#22c55e40',
          background: '#22c55e10',
        },
        standardError: {
          borderColor: '#ef444440',
          background: '#ef444410',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: { color: '#3b82f6' },
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
