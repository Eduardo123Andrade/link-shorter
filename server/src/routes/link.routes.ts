import { FastifyInstance } from 'fastify';
import { linkService } from '../services/link.service';

export async function linkRoutes(app: FastifyInstance) {
  // Criar link encurtado
  app.post('/links', async (request, reply) => {
    try {
      const { link, shortLink } = request.body as {
        link: string;
        shortLink: string;
      };

      if (!link) {
        return reply.status(400).send({
          error: 'Link is required',
        });
      }

      if (!shortLink) {
        return reply.status(400).send({
          error: 'Short link is required',
        });
      }

      const createdLink = await linkService.createLink({
        link,
        shortLink,
      });

      return reply.status(201).send({
        id: createdLink.id,
        link: createdLink.link,
        shortLink: createdLink.shortLink,
        shortUrl: `${request.protocol}://${request.hostname}/${createdLink.shortLink}`,
        createdAt: createdLink.createdAt,
      });
    } catch (error) {
      return reply.status(400).send({
        error: (error as Error).message,
      });
    }
  });

  // Listar links com paginação
  app.get('/links', async (request, reply) => {
    const { page = 1, limit = 10 } = request.query as {
      page?: number;
      limit?: number;
    };

    const result = await linkService.listLinks(Number(page), Number(limit));

    return reply.send(result);
  });

  // Obter estatísticas de um link
  app.get('/links/:id/stats', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const link = await linkService.getLinkByShortCode(id);

      if (!link) {
        return reply.status(404).send({
          error: 'Link not found',
        });
      }

      const stats = await linkService.getLinkStats(link.id);

      return reply.send({
        link: link.link,
        shortLink: link.shortLink,
        createdAt: link.createdAt,
        stats,
      });
    } catch (error) {
      return reply.status(500).send({
        error: (error as Error).message,
      });
    }
  });

  // Deletar um link
  app.delete('/links/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await linkService.deleteLink(id);
      return reply.status(204).send();
    } catch (error) {
      return reply.status(404).send({
        error: 'Link not found',
      });
    }
  });

  // Redirecionar usando link curto (registra acesso)
  app.get('/:shortLink', async (request, reply) => {
    const { shortLink } = request.params as { shortLink: string };

    try {
      const link = await linkService.getLinkByShortCode(shortLink);

      if (!link) {
        return reply.status(404).send({
          error: 'Link not found',
        });
      }

      // Registra o acesso de forma assíncrona
      linkService
        .registerAccess(link.id)
        .catch((err) => {
          app.log.error('Failed to register access:', err);
        });

      // Redireciona imediatamente
      return reply.redirect(301, link.link);
    } catch (error) {
      return reply.status(500).send({
        error: 'Internal server error',
      });
    }
  });
}
