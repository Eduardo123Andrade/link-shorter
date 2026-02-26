function getBaseUrl() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:3333`;
  }

  return 'http://localhost:3333';
}

export const API_URL = getBaseUrl();
export const WS_URL = API_URL.replace(/^http/, 'ws') + '/ws';
