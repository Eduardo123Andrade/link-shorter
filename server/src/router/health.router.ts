import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { HealthCheckController } from '../controller';
import { healthResponseSchema } from '../schemas';

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
