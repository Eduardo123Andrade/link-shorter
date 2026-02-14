import { FastifyRequest, FastifyReply } from "fastify";
import { listAllLinks } from "../use-case";
import { HttpStatus, env } from "../utils";

export const listAllLinksController = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  const links = await listAllLinks();

  const formattedLinks = links.map((link) => ({
    ...link,
    shortLink: `${env.BASE_URL}/${link.shortLink}`,
  }));

  return reply.status(HttpStatus.OK).send(formattedLinks);
};
