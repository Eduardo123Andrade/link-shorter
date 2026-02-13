import { prisma } from '../lib/prisma';
import { isValidUrl } from '../lib/link-generator';

export interface CreateLinkInput {
  link: string;
  shortLink: string;
}

export interface LinkStats {
  totalAccesses: number;
  lastAccessed?: Date;
}

export class LinkService {
  /**
   * Cria um novo link encurtado
   */
  async createLink(input: CreateLinkInput) {
    if (!isValidUrl(input.link)) {
      throw new Error('Invalid URL provided');
    }

    if (!input.shortLink) {
      throw new Error('Short link is required');
    }

    // Verifica se o shortLink já existe
    const existingLink = await prisma.link.findUnique({
      where: { shortLink: input.shortLink },
    });

    if (existingLink) {
      throw new Error('Short link already exists');
    }

    const link = await prisma.link.create({
      data: {
        link: input.link,
        shortLink: input.shortLink,
      },
    });

    return link;
  }

  /**
   * Busca um link pelo código curto
   */
  async getLinkByShortCode(shortLink: string) {
    return prisma.link.findUnique({
      where: { shortLink },
    });
  }

  /**
   * Registra um acesso ao link
   */
  async registerAccess(linkId: string) {
    return prisma.linkAccess.create({
      data: {
        linkId,
      },
    });
  }

  /**
   * Obtém estatísticas de um link
   */
  async getLinkStats(linkId: string): Promise<LinkStats> {
    const [totalAccesses, lastAccess] = await Promise.all([
      // Total de acessos
      prisma.linkAccess.count({
        where: { linkId },
      }),
      // Último acesso
      prisma.linkAccess.findFirst({
        where: { linkId },
        orderBy: { accessedAt: 'desc' },
        select: { accessedAt: true },
      }),
    ]);

    return {
      totalAccesses,
      lastAccessed: lastAccess?.accessedAt,
    };
  }

  /**
   * Lista todos os links com paginação
   */
  async listLinks(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [links, total] = await Promise.all([
      prisma.link.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { accesses: true },
          },
        },
      }),
      prisma.link.count(),
    ]);

    return {
      links,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Deleta um link e todos seus acessos
   */
  async deleteLink(linkId: string) {
    return prisma.link.delete({
      where: { id: linkId },
    });
  }
}

export const linkService = new LinkService();
