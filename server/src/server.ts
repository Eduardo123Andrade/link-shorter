import 'dotenv/config';
import Fastify from 'fastify';
import { prisma } from './lib/prisma';
import { linkRoutes } from './routes/link.routes';

const app = Fastify({
  logger: true,
});

// Health check route
app.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Database connection check
app.get('/health/db', async (request, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'connected' };
  } catch (error) {
    reply.status(503);
    return { status: 'error', database: 'disconnected', error: (error as Error).message };
  }
});

// Registrar rotas de links
app.register(linkRoutes);

// Graceful shutdown
const gracefulShutdown = async () => {
  app.log.info('Shutting down gracefully...');
  await prisma.$disconnect();
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
    await prisma.$disconnect();
    process.exit(1);
  }
};

start();
