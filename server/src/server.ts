import 'dotenv/config';
import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  hasZodFastifySchemaValidationErrors,
} from 'fastify-type-provider-zod';
import { disconnectPrisma } from './lib/prisma';
import { DomainError } from './errors';
import { HttpStatus } from './utils';
import { healthRouter, linkRouter } from './router';

const app = Fastify({
  logger: true,
});

// Zod type provider
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Swagger
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

// Error handler
app.setErrorHandler((error, _request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of error.validation) {
      const field = issue.instancePath.replace(/^\//, "") || (issue.params as Record<string, any>)?.issue?.path?.[0] || "unknown";
      if (!fieldErrors[field]) fieldErrors[field] = [];
      fieldErrors[field].push(issue.message ?? "Validation error");
    }

    return reply.status(HttpStatus.BAD_REQUEST).send({
      errors: fieldErrors,
    });
  }

  if (error instanceof DomainError) {
    return reply.status(error.statusCode).send({
      error: error.message,
      ...(("fieldErrors" in error) && { errors: (error as any).fieldErrors }),
    });
  }

  return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
    error: "Internal server error",
  });
});

// Registrar rotas
app.register(healthRouter);
app.register(linkRouter);

// Graceful shutdown
const gracefulShutdown = async () => {
  app.log.info('Shutting down gracefully...');
  await disconnectPrisma();
  await app.close();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333;
    const host = process.env.HOST || '0.0.0.0';

    await app.listen({ port, host });
    app.log.info(`Server running at http://${host}:${port}`);
    app.log.info(`Swagger docs at http://${host}:${port}/docs`);
  } catch (err) {
    app.log.error(err);
    await disconnectPrisma();
    process.exit(1);
  }
};

start();
