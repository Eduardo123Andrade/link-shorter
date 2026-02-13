import 'dotenv/config';
import Fastify from 'fastify';
import { disconnectPrisma } from './lib/prisma';
import { healthRouter, linkRouter } from './router';

const app = Fastify({
  logger: true,
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
  } catch (err) {
    app.log.error(err);
    await disconnectPrisma();
    process.exit(1);
  }
};

start();
