import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider, createTheme } from '@mui/material/styles'

// Catch global JS errors for debugging white screen
window.addEventListener('error', (e) => {
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#222;color:#f44;padding:12px;z-index:9999;font-size:13px;font-family:monospace;white-space:pre-wrap';
  div.textContent = `☠ ${e.message}\n${e.filename || ''}:${e.lineno || ''}`;
  document.body.appendChild(div);
});

window.addEventListener('unhandledrejection', (e) => {
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;bottom:40px;left:0;right:0;background:#222;color:#f90;padding:12px;z-index:9999;font-size:13px;font-family:monospace;white-space:pre-wrap';
  div.textContent = `⚠ Promise: ${e.reason?.message || e.reason || 'unknown'}`;
  document.body.appendChild(div);
});

function ErrorFallback({ error }: { error: Error }) {
  return React.createElement('div', {
    style: { padding: 40, color: '#f44', fontFamily: 'monospace', fontSize: 14 }
  }, [
    React.createElement('h2', { key: 'h' }, '☠ Hata oluştu'),
    React.createElement('pre', { key: 'p', style: { whiteSpace: 'pre-wrap' } }, error.message),
    React.createElement('pre', { key: 's', style: { whiteSpace: 'pre-wrap', fontSize: 11, opacity: 0.7 } }, error.stack),
  ]);
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) return React.createElement(ErrorFallback, { error: this.state.error });
    return this.props.children;
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0b1220',
      paper: '#0f172a',
    },
    primary: {
      main: '#60a5fa',
    },
  },
  typography: {
    fontFamily: [
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  React.createElement(ErrorBoundary, null,
    React.createElement(React.StrictMode, null,
      React.createElement(ThemeProvider, { theme },
        React.createElement(App)
      )
    )
  ),
)
