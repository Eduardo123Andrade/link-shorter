import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';

import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export const registerSwagger = (app: FastifyInstance) => {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Link Shorter API',
        description: 'API para encurtar e gerenciar links',
        version: '1.0.0',
      },
      tags: [
        { name: 'Health', description: 'Health check endpoints' },
        { name: 'Links', description: 'Link management endpoints' },
      ],
    },
    transform: jsonSchemaTransform,
  });

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });
};
