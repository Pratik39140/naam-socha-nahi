import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={createTheme({ palette: { mode: 'dark', background: { default: '#242424', paper: '$1a1a1a' }} })}>
      <CssBaseline />
      <App />
    </ThemeProvider>

  </StrictMode>,
)
