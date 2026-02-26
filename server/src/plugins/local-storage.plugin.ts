import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { FastifyInstance } from 'fastify';

export const registerLocalStorage = async (app: FastifyInstance) => {
  app.get('/tmp/*', async (request, reply) => {
    const key = (request.params as { '*': string })['*'];
    const filePath = join(process.cwd(), 'tmp', key);

    try {
      const content = await readFile(filePath);
      const filename = key.split('/').pop() ?? 'file';
      return reply
        .header('Content-Type', 'text/csv')
        .header('Content-Disposition', `attachment; filename="${filename}"`)
        .send(content);
    } catch {
      return reply.status(404).send({ message: 'File not found' });
    }
  });
};
