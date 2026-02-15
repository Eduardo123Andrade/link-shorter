const API_PORT = 3333;

function getHost() {
  if (typeof window === 'undefined') return 'localhost';
  return window.location.hostname;
}

export const API_URL = `http://${getHost()}:${API_PORT}`;
export const WS_URL = `ws://${getHost()}:${API_PORT}/ws`;
