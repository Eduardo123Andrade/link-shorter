import { FastifyRequest, FastifyReply } from 'fastify';
import { generateLinkReport } from '../use-case/generate-link-report.use-case';
import { HttpStatus } from '../utils';

export const generateLinkReportController = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  const result = await generateLinkReport();
  return reply.status(HttpStatus.OK).send(result);
};
