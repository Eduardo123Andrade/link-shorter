import { z } from "zod";
import { ValidationError } from "../errors";

export const validateSchema = <T extends z.ZodType>(
  schema: T,
  data: unknown
): z.output<T> => {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw new ValidationError(z.flattenError(parsed.error).fieldErrors);
  }

  return parsed.data;
};
