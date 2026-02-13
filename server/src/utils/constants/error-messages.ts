/**
 * Error messages for the application
 */

export const ERROR_MESSAGES = {
  // Link errors
  LINK_NOT_FOUND: "Link not found",
  LINK_ALREADY_EXISTS: "Link with this short code already exists",
  INVALID_URL: "Invalid URL format",
  INVALID_SHORT_LINK: "Invalid short link format",
  SHORT_LINK_TOO_LONG: "Short link is too long (max 50 characters)",
  SHORT_LINK_REQUIRED: "Short link is required",
  LINK_URL_REQUIRED: "Link URL is required",

  // Validation errors
  INVALID_UUID: "Invalid UUID",
  INVALID_UUID_FIELD: "Invalid UUID for field",

  // Database errors
  DATABASE_ERROR: "Database error",
  CONNECTION_ERROR: "Database connection error",

  // Generic errors
  INTERNAL_SERVER_ERROR: "Internal server error",
  BAD_REQUEST: "Bad request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
} as const;

export type ErrorMessage = typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES];
