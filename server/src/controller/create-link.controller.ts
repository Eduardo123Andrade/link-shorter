import { FastifyRequest, FastifyReply } from "fastify";
import { createLink } from "../use-case";
import { createLinkSchema } from "../schemas";
import { HttpStatus } from "../utils";
import { z } from "zod";

export const createLinkController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const parsed = createLinkSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply
      .status(HttpStatus.BAD_REQUEST)
      .send({ errors: z.flattenError(parsed.error).fieldErrors });
  }

  const createdLink = await createLink(parsed.data);

  return reply.status(HttpStatus.CREATED).send({
    id: createdLink.id,
    link: createdLink.link,
    shortLink: createdLink.shortLink,
    shortUrl: `${request.protocol}://${request.hostname}/${createdLink.shortLink}`,
    createdAt: createdLink.createdAt,
  });
};
