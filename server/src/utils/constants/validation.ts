/**
 * Constantes de validação
 */

export const VALIDATION = {
  SHORT_LINK: {
    MAX_LENGTH: 50,
    MIN_LENGTH: 1,
    PATTERN: /^[a-zA-Z0-9-_]+$/,
  },
  LINK: {
    MAX_LENGTH: 2048,
    URL_PATTERN: /^https?:\/\/.+/,
  },
} as const;
