import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker after the page is fully loaded to avoid
// "document is in an invalid state" InvalidStateError.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    import('virtual:pwa-register').then(({ registerSW }) => {
      registerSW({ immediate: false })
    }).catch(() => {
      // SW not available (dev without devOptions or unsupported browser)
    })
  })
}
