import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root');

// --- Global Fetch Interceptor for Auth Token ---
const originalFetch = window.fetch;
window.fetch = async function (resource, config) {
    const url = typeof resource === 'string' ? resource : (resource instanceof URL ? resource.toString() : resource?.url || '');
    
    // Automatically attach token for any internal /api/ requests
    if (url.includes('/api/')) {
        config = config || {};
        config.headers = config.headers ? new Headers(config.headers) : new Headers();
        
        const token = localStorage.getItem('authToken');
        if (token && !config.headers.has('Authorization')) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
    }
    return originalFetch(resource, config);
};
// -----------------------------------------------
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
