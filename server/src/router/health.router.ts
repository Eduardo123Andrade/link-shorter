import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { HttpStatus } from "../utils";
import {
  healthResponseSchema,
  healthDbResponseSchema,
  healthDbErrorResponseSchema,
} from "../schemas";

export async function healthRouter(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.get("/health", {
    schema: {
      tags: ["Health"],
      summary: "Health check",
      response: {
        200: healthResponseSchema,
      },
    },
    handler: async (_request, reply) => {
      return reply.status(HttpStatus.OK).send({
        status: "ok",
        timestamp: new Date().toISOString(),
      });
    },
  });

  typedApp.get("/health/db", {
    schema: {
      tags: ["Health"],
      summary: "Database connection check",
      response: {
        200: healthDbResponseSchema,
        503: healthDbErrorResponseSchema,
      },
    },
    handler: async (_request, reply) => {
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
    },
  });
}
