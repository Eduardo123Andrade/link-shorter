import { prisma } from '../lib/prisma';

const create = async (linkId: string) => {
  const [access] = await prisma.$transaction([
    prisma.linkAccess.create({
      data: {
        linkId,
      },
    }),
    prisma.link.update({
      where: {
        id: linkId,
      },
      data: {
        accessCount: {
          increment: 1,
        },
      },
    }),
  ]);

  return access;
};

export const LinkAccessRepository = {
  create,
};
