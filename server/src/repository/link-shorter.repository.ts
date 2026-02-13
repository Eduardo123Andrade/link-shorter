import { prisma } from "../lib/prisma";
import { ICreateLinkInput } from "../interfaces";

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
  const deletedLink = await prisma.link.delete({
    where: {
      id,
    },
  });
  return deletedLink;
};

export const LinkShorterRepository = {
  save,
  findById,
  findByShortLink,
  listAll,
  deleteById,
};
