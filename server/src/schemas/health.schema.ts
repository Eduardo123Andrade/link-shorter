import { z } from 'zod';

export const healthResponseSchema = z.object({
  status: z.string(),
  database: z.string(),
  timestamp: z.string(),
});

export const healthDbResponseSchema = z.object({
  status: z.string(),
  database: z.string(),
});

export const healthDbErrorResponseSchema = z.object({
  status: z.string(),
  database: z.string(),
  error: z.string(),
});
