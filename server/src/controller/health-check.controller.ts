import { FastifyReply, FastifyRequest } from 'fastify';
import { CheckDatabaseUseCase } from '../use-case';
import { HttpStatus } from '../utils';

const check = async (request: FastifyRequest, reply: FastifyReply) => {
  const isConnected = await CheckDatabaseUseCase.check();

  return reply.status(HttpStatus.OK).send({
    status: 'ok',
    database: isConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
};

export const HealthCheckController = {
  check,
};
