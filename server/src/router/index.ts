import { FastifyInstance } from 'fastify';

import { healthRouter } from './health.router';
import { linkRouter } from './link.router';

export const registerRouter = (app: FastifyInstance) => {
  app.register(healthRouter);
  app.register(linkRouter);
};
