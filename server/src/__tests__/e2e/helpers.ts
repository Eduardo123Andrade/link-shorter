import Fastify, { FastifyInstance } from "fastify";
import { healthRouter, linkRouter } from "../../router";
import { DomainError } from "../../errors";
import { HttpStatus } from "../../utils";

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({ logger: false });

  app.setErrorHandler((error, _request, reply) => {
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

  app.register(healthRouter);
  app.register(linkRouter);

  await app.ready();

  return app;
};
