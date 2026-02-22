import { FastifyReply, FastifyRequest } from 'fastify';
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';
import { ZodError } from 'zod';
import { DomainError } from './domain.error';
import { HttpStatus } from '../utils';

export const errorHandler = (
  error: Error | ZodError,
  _: FastifyRequest,
  reply: FastifyReply
) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of error.validation) {
      const field =
        issue.instancePath.replace(/^\//, '') ||
        (issue.params as Record<string, any>)?.issue?.path?.[0] ||
        'unknown';
      if (!fieldErrors[field]) fieldErrors[field] = [];
      fieldErrors[field].push(issue.message ?? 'Validation error');
    }

    return reply.status(HttpStatus.BAD_REQUEST).send({
      errors: fieldErrors,
    });
  }

  if (error instanceof DomainError) {
    return reply.status(error.statusCode).send({
      error: error.message,
      ...('fieldErrors' in error && { errors: (error as any).fieldErrors }),
    });
  }

  // console.error(error); // Consider logging the error for debugging

  return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
    error: 'Internal server error',
  });
};
