import { FastifyRequest, FastifyReply } from 'fastify';
import { findLinkByShortLink } from '../use-case';
import { shortLinkParamSchema } from '../schemas';
import { validateSchema } from '../helpers';
import { HttpStatus } from '../utils';
import { appEventEmitter } from '../lib/event-emitter';
import { LINK_ACCESSED_EVENT } from '../events';

export const findLinkByShortLinkController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const data = validateSchema(shortLinkParamSchema, request.params);

  const link = await findLinkByShortLink(data);

  const purpose =
    request.headers['purpose'] ||
    request.headers['sec-purpose'] ||
    request.headers['x-purpose'] ||
    request.headers['x-moz'];

  const isPrefetch =
    typeof purpose === 'string' &&
    (purpose.toLowerCase().includes('prefetch') ||
      purpose.toLowerCase().includes('preview') ||
      purpose.toLowerCase().includes('prerender'));

  if (!isPrefetch) {
    appEventEmitter.emit(LINK_ACCESSED_EVENT, { linkId: link.id });
  }

  return reply.code(HttpStatus.FOUND).redirect(link.link);
};
