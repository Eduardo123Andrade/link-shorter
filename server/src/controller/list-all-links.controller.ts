import { FastifyRequest, FastifyReply } from "fastify";
import { listAllLinks } from "../use-case";
import { HttpStatus } from "../utils";

export const listAllLinksController = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  const links = await listAllLinks();

  return reply.status(HttpStatus.OK).send(links);
};
