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
      main: '#F69E3D',
      light: '#FFB85F',
      dark: '#d4831e',
    },
    secondary: {
      main: '#FFB85F',
    },
    background: {
      default: '#1A1A1A',
      paper: '#373A3C',
    },
    divider: '#5E6266',
    text: {
      primary: '#F2F2F2',
      secondary: '#B0B3B8',
    },
    success: { main: '#22c55e' },
    error: { main: '#D93025' },
    warning: { main: '#FFB85F' },
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
          background: '#373A3C',
          border: '1px solid #5E6266',
          boxShadow: '0 4px 32px #00000050',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#1A1A1A',
          borderBottom: '1px solid #5E6266',
          boxShadow: 'none',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: '#1A1A1A',
          borderTop: '1px solid #5E6266',
          height: 64,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#5E6266',
          '&.Mui-selected': {
            color: '#F69E3D',
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
          background: 'linear-gradient(135deg, #F69E3D, #d4831e)',
          boxShadow: '0 4px 16px #F69E3D40',
          color: '#1A1A1A',
          fontWeight: 700,
          '&:hover': {
            background: 'linear-gradient(135deg, #FFB85F, #F69E3D)',
            boxShadow: '0 6px 20px #F69E3D60',
          },
          '&.Mui-disabled': {
            background: '#373A3C',
            color: '#5E6266',
          },
        },
        outlined: {
          borderColor: '#5E6266',
          color: '#B0B3B8',
          '&:hover': {
            borderColor: '#F69E3D',
            color: '#F69E3D',
            background: '#F69E3D10',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            background: '#1A1A1A',
            '& fieldset': { borderColor: '#5E6266' },
            '&:hover fieldset': { borderColor: '#9FA3A7' },
            '&.Mui-focused fieldset': { borderColor: '#F69E3D' },
          },
          '& .MuiInputLabel-root': { color: '#B0B3B8' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#F69E3D' },
          '& .MuiOutlinedInput-input': { color: '#F2F2F2' },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          background: '#1A1A1A',
          color: '#F2F2F2',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#5E6266' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9FA3A7' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#F69E3D' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#373A3C',
          backgroundImage: 'none',
          border: '1px solid #5E6266',
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
          borderColor: '#D9302540',
          background: '#D9302510',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: { color: '#F69E3D' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
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
