import { z } from 'zod';
import { ERROR_MESSAGES, VALIDATION } from '../utils';

export const createLinkSchema = z.object({
  link: z
    .string({ message: ERROR_MESSAGES.LINK_URL_REQUIRED })
    .url(ERROR_MESSAGES.INVALID_URL)
    .max(VALIDATION.LINK.MAX_LENGTH),
  shortLink: z
    .string({ message: ERROR_MESSAGES.SHORT_LINK_REQUIRED })
    .min(VALIDATION.SHORT_LINK.MIN_LENGTH, ERROR_MESSAGES.SHORT_LINK_REQUIRED)
    .max(VALIDATION.SHORT_LINK.MAX_LENGTH, ERROR_MESSAGES.SHORT_LINK_TOO_LONG)
    .regex(VALIDATION.SHORT_LINK.PATTERN, ERROR_MESSAGES.INVALID_SHORT_LINK),
});

export const shortLinkParamSchema = z.object({
  shortLink: z
    .string({ message: ERROR_MESSAGES.INVALID_SHORT_LINK })
    .min(VALIDATION.SHORT_LINK.MIN_LENGTH, ERROR_MESSAGES.INVALID_SHORT_LINK)
    .regex(VALIDATION.SHORT_LINK.PATTERN, ERROR_MESSAGES.INVALID_SHORT_LINK),
});

export const idParamSchema = z.object({
  id: z
    .string({ message: ERROR_MESSAGES.INVALID_UUID })
    .uuid(ERROR_MESSAGES.INVALID_UUID),
});

// Response schemas
export const linkResponseSchema = z.object({
  id: z.uuidv7(),
  link: z.url(),
  shortLink: z.url(),
});

export const linkListItemSchema = z.object({
  id: z.uuidv7(),
  link: z.url(),
  shortLink: z.url(),
  accessCount: z.number(),
});

export const linkListResponseSchema = z.array(linkListItemSchema);

export const noContentResponseSchema = z.null().describe('Link deleted');

export const redirectResponseSchema = z
  .null()
  .describe('Redirect to original URL');

export const errorResponseSchema = z.object({
  errors: z.record(z.string(), z.array(z.string()).optional()),
});
