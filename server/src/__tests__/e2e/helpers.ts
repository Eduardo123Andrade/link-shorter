import Fastify, { FastifyInstance } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  hasZodFastifySchemaValidationErrors,
} from "fastify-type-provider-zod";
import { healthRouter, linkRouter } from "../../router";
import { DomainError } from "../../errors";
import { HttpStatus } from "../../utils";

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({ logger: false });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

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

  app.register(healthRouter);
  app.register(linkRouter);

  await app.ready();

  return app;
};
