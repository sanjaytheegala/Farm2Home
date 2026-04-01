import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './i18n';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SpeedInsights } from '@vercel/speed-insights/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <App />
        <SpeedInsights />
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);

// Preload critical resources
const preloadCriticalResources = () => {
  const criticalImages = [
    '/images/fruits.jpg',
    '/images/vegetables.jpg',
    '/images/dry fruits.jpg',
    '/images/apple.jpg',
    '/images/banana.jpg'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Execute preloading after initial render
setTimeout(preloadCriticalResources, 100);

// Recover from stale cached bundles that reference old lazy-load chunk URLs.
// This typically manifests as:
//   - ChunkLoadError: Loading chunk ... failed
//   - SyntaxError: Unexpected token '<' (HTML returned for missing chunk)
// We reload once per tab session to fetch the newest bundle/chunk graph.
const CHUNK_RELOAD_GUARD_KEY = 'chunk_reload_once_v1';
const shouldReloadForChunkError = (err) => {
  const message = (err && (err.message || err.toString && err.toString())) || '';
  return (
    /ChunkLoadError/i.test(message) ||
    /Loading chunk [^\s]+ failed/i.test(message) ||
    /Unexpected token\s*'</i.test(message)
  );
};

const attemptChunkRecoveryReload = (err) => {
  if (!shouldReloadForChunkError(err)) return;
  if (sessionStorage.getItem(CHUNK_RELOAD_GUARD_KEY)) return;
  sessionStorage.setItem(CHUNK_RELOAD_GUARD_KEY, '1');
  window.location.reload();
};

window.addEventListener('error', (event) => {
  attemptChunkRecoveryReload(event?.error || event);
});

window.addEventListener('unhandledrejection', (event) => {
  attemptChunkRecoveryReload(event?.reason);
});
