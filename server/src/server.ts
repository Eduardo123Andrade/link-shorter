import 'dotenv/config';
import { env } from './utils';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { errorHandler } from './errors/error-handler';
import { disconnectPrisma } from './lib/prisma';
import { registerRouter } from './router';
import { registerSwagger, registerWebSocket } from './plugins';
import { setupEventListeners } from './events';

const app = Fastify({
  logger: true,
});

// CORS
app.register(cors, { origin: true, methods: ['GET', 'POST', 'PUT', 'DELETE'] });

// Zod type provider
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

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
    const port = env.PORT;
    const host = env.HOST;

    // 1. Plugins
    registerSwagger(app);
    await registerWebSocket(app);

    // 2. Error handler
    app.setErrorHandler(errorHandler);

    // 3. Registrar rotas
    registerRouter(app);
    setupEventListeners();

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
