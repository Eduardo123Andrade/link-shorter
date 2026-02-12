import { FastifyRequest, FastifyReply } from "fastify";
import { deleteLink } from "../use-case";
import { idParamSchema } from "../schemas";
import { HttpStatus } from "../utils";
import { z } from "zod";

export const deleteLinkController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const parsed = idParamSchema.safeParse(request.params);

  if (!parsed.success) {
    return reply
      .status(HttpStatus.BAD_REQUEST)
      .send({ errors: z.flattenError(parsed.error).fieldErrors });
  }

  await deleteLink(parsed.data);

  return reply.status(HttpStatus.NO_CONTENT).send();
};
