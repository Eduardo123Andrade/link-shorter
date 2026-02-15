import { z } from "zod";

export const createLinkSchema = z.object({
  originalUrl: z
    .string()
    .min(1, "A URL original é obrigatória")
    .regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, "Informe uma URL válida (ex: https://exemplo.com)"),
  customSuffix: z
    .string()
    .regex(/^[a-zA-Z0-9-_]*$/, "Use apenas letras, números, hífens e underscores")
    .optional()
    .or(z.literal("")),
});

export type CreateLinkFormData = z.infer<typeof createLinkSchema>;
