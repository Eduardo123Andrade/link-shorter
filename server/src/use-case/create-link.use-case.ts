import { LinkShorterRepository } from '../repository';
import { generateUuid } from '../utils';

interface CreateLinkInput {
  link: string;
  shortLink: string;
}

interface CreateLinkOutput {
  id: string;
  link: string;
  shortLink: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createLink = async (
  input: CreateLinkInput
): Promise<CreateLinkOutput> => {
  const id = generateUuid();

  const savedLink = await LinkShorterRepository.save({
    id,
    link: input.link,
    shortLink: input.shortLink,
  });

  return savedLink;
};
