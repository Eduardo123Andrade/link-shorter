const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

// Função utilitária básica para falback caso não haja variável configurada
function getBaseUrl() {
  if (NEXT_PUBLIC_API_URL) return NEXT_PUBLIC_API_URL;
  
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:3333`;
  }
  
  return 'http://localhost:3333';
}

export const API_URL = getBaseUrl();
export const WS_URL = API_URL.replace(/^http/, 'ws') + '/ws';
