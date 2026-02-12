import { FastifyRequest, FastifyReply } from "fastify";
import { findLinkByShortLink } from "../use-case";
import { shortLinkParamSchema } from "../schemas";
import { validateSchema } from "../helpers";
import { HttpStatus } from "../utils";

export const findLinkByShortLinkController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const data = validateSchema(shortLinkParamSchema, request.params);

  const link = await findLinkByShortLink(data);

  return reply.code(HttpStatus.FOUND).redirect(link.link);
};
