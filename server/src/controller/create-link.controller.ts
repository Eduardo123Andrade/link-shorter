import { FastifyRequest, FastifyReply } from "fastify";
import { createLink } from "../use-case";
import { createLinkSchema } from "../schemas";
import { validateSchema } from "../helpers";
import { HttpStatus } from "../utils";

export const createLinkController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const data = validateSchema(createLinkSchema, request.body);

  const createdLink = await createLink(data);

  return reply.status(HttpStatus.CREATED).send({
    id: createdLink.id,
    link: createdLink.link,
    shortLink: createdLink.shortLink,
    shortUrl: `${request.protocol}://${request.hostname}/${createdLink.shortLink}`,
  });
};
