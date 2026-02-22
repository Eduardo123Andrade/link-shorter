import { prisma } from "../lib/prisma";
import { ICreateLinkInput } from "../interfaces";
import { LinkNotFoundError } from "../errors";

const save = async (linkData: ICreateLinkInput) => {
  const savedLink = await prisma.link.create({
    data: {
      id: linkData.id,
      link: linkData.link,
      shortLink: linkData.shortLink,
    },
  });
  return savedLink;
};

const findById = async (id: string) => {
  const link = await prisma.link.findUnique({
    where: {
      id,
    },
  });

  if(!link) {
    throw new LinkNotFoundError();
  }

  return link;
};

const findByShortLink = async (shortLink: string) => {
  const link = await prisma.link.findUnique({
    where: {
      shortLink,
    },
  });
  return link;
};

const listAll = async () => {
  const links = await prisma.link.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return links;
};

const deleteById = async (id: string) => {
  await findById(id);
  
  const deletedLink = await prisma.link.delete({
    where: {
      id,
    },
  });
  return deletedLink;
};

const incrementAccess = async (id: string) => {
  await findById(id);

  const updatedLink = await prisma.link.update({
    where: {
      id,
    },
    data: {
      accessCount: {
        increment: 1,
      },
    },
  });
  return updatedLink;
};

export const LinkShorterRepository = {
  save,
  findById,
  findByShortLink,
  listAll,
  deleteById,
  incrementAccess
};
