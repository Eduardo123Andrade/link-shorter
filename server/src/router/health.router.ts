import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from '../lib/prisma';
import { HttpStatus } from '../utils';
import {
  healthResponseSchema,
  healthDbResponseSchema,
  healthDbErrorResponseSchema,
} from '../schemas';
import { HealthCheckController } from '../controller';

export async function healthRouter(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.get('/health', {
    schema: {
      tags: ['Health'],
      summary: 'Health check',
      response: {
        200: healthResponseSchema,
      },
    },
    handler: HealthCheckController.check,
  });
}
