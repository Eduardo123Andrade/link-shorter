import { FastifyRequest, FastifyReply } from "fastify";
import { deleteLink } from "../use-case";
import { idParamSchema } from "../schemas";
import { validateSchema } from "../helpers";
import { HttpStatus } from "../utils";

export const deleteLinkController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const data = validateSchema(idParamSchema, request.params);

  await deleteLink(data);

  return reply.status(HttpStatus.NO_CONTENT).send();
};
