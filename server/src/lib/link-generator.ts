/**
 * Gera um código curto aleatório para o link
 * @param length Tamanho do código (padrão: 6)
 * @returns Código curto gerado
 */
export function generateShortCode(length: number = 6): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

/**
 * Valida se uma string é uma URL válida
 * @param url String para validar
 * @returns true se for uma URL válida
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Normaliza uma URL removendo fragmentos e query strings desnecessárias (opcional)
 * @param url URL para normalizar
 * @returns URL normalizada
 */
export function normalizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    // Remove trailing slash
    parsedUrl.pathname = parsedUrl.pathname.replace(/\/$/, '') || '/';
    return parsedUrl.toString();
  } catch {
    return url;
  }
}
