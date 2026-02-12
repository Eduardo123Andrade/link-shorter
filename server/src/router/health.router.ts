import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { HttpStatus } from "../utils";

export async function healthRouter(app: FastifyInstance) {
  app.get("/health", async (_request, reply) => {
    return reply.status(HttpStatus.OK).send({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/health/db", async (_request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return reply.status(HttpStatus.OK).send({
        status: "ok",
        database: "connected",
      });
    } catch (error) {
      return reply.status(HttpStatus.SERVICE_UNAVAILABLE).send({
        status: "error",
        database: "disconnected",
        error: (error as Error).message,
      });
    }
  });
}
