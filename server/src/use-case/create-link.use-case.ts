import { LinkShorterRepository } from '../repository';
import { generateUuid } from '../utils';
import { LinkAlreadyExistsError } from '../errors';

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
  const existingLink = await LinkShorterRepository.findByShortLink(input.shortLink);

  if (existingLink) {
    throw new LinkAlreadyExistsError();
  }

  let finalLink = input.link;
  if (!/^https?:\/\//i.test(finalLink)) {
    finalLink = `http://${finalLink}`;
  }

  const id = generateUuid();

  const savedLink = await LinkShorterRepository.save({
    id,
    link: finalLink,
    shortLink: input.shortLink,
  });

  return savedLink;
};
