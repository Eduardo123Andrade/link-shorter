import { FastifyRequest, FastifyReply } from "fastify";
import { findLinkByShortLink } from "../use-case";
import { shortLinkParamSchema } from "../schemas";
import { HttpStatus } from "../utils";
import { z } from "zod";

export const findLinkByShortLinkController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const parsed = shortLinkParamSchema.safeParse(request.params);

  if (!parsed.success) {
    return reply
      .status(HttpStatus.BAD_REQUEST)
      .send({ errors: z.flattenError(parsed.error).fieldErrors });
  }

  const link = await findLinkByShortLink(parsed.data);

  return reply.code(HttpStatus.FOUND).redirect(link.link);
};
