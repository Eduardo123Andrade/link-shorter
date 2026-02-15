import { prisma } from '../lib/prisma';

const create = async (linkId: string) => {


  // const [, updatedLink] = await prisma.$transaction([
  //   prisma.linkAccess.create({
  //     data: {
  //       linkId,
  //     },
  //   }),
  //   prisma.link.update({
  //     where: {
  //       id: linkId,
  //     },
  //     data: {
  //       accessCount: {
  //         increment: 1,
  //       },
  //     },
  //   }),
  // ]);

  const x = await prisma.linkAccess.upsert({
    where: {linkId},
    create: {
      linkId,
    },
    update: {
      accessedAt: {
        increment: 1,
      }
    }

    
  })

  return updatedLink;
};

export const LinkAccessRepository = {
  create,
};
