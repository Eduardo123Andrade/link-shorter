import { z } from "zod";

export const createLinkSchema = z.object({
  originalUrl: z
    .string()
    .min(1, "A URL original é obrigatória")
    .regex(/^(https?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,})([/?#]\S*)?$/, "Informe uma URL válida (ex: https://exemplo.com)"),
  customSuffix: z
    .string()
    .regex(/^[a-zA-Z0-9-_]*$/, "Use apenas letras, números, hífens e underscores")
    .optional()
    .or(z.literal("")),
});

export type CreateLinkFormData = z.infer<typeof createLinkSchema>;
