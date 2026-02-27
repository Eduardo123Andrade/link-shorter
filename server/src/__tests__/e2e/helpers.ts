import Fastify, { FastifyInstance } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { healthRouter } from '../../router/health.router';
import { linkRouter } from '../../router/link.router';
import { errorHandler } from '../../errors/error-handler';
import { registerLocalStorage } from '../../plugins/local-storage.plugin';
import { env } from '../../utils/env';

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({ logger: false });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler(errorHandler);

  app.register(healthRouter);
  app.register(linkRouter);

  if (env.STORAGE_DRIVER === 'local') {
    await registerLocalStorage(app);
  }

  await app.ready();

  return app;
};
