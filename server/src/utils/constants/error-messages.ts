/**
 * Error messages for the application
 */

export const ERROR_MESSAGES = {
  // Link errors
  LINK_NOT_FOUND: "Link não encontrado",
  LINK_ALREADY_EXISTS: "Já existe um link com este código curto",
  INVALID_URL: "Formato de URL inválido",
  INVALID_SHORT_LINK: "Formato de link curto inválido",
  SHORT_LINK_TOO_LONG: "O link curto é muito longo (máx. 50 caracteres)",
  SHORT_LINK_REQUIRED: "O link curto é obrigatório",
  LINK_URL_REQUIRED: "A URL original é obrigatória",

  // Validation errors
  INVALID_UUID: "UUID inválido",
  INVALID_UUID_FIELD: "UUID inválido para o campo",

  // Database errors
  DATABASE_ERROR: "Erro no banco de dados",
  CONNECTION_ERROR: "Erro de conexão com o banco de dados",

  // Generic errors
  INTERNAL_SERVER_ERROR: "Erro interno do servidor",
  BAD_REQUEST: "Requisição inválida",
  UNAUTHORIZED: "Não autorizado",
  FORBIDDEN: "Proibido",
} as const;

export type ErrorMessage = typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES];
