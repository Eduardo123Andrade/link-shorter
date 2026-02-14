import { LinkShorterRepository } from '../repository';

interface ListAllLinksOutput {
  id: string;
  link: string;
  shortLink: string;
  createdAt: Date;
  updatedAt: Date;
}

export const listAllLinks = async (): Promise<ListAllLinksOutput[]> => {
  const links = await LinkShorterRepository.listAll();

  return links;
};
