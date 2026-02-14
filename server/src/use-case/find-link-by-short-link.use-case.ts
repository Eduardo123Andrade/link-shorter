import { LinkShorterRepository } from '../repository';
import { LinkNotFoundError } from '../errors';
import { env } from '../utils';

interface FindLinkByShortLinkInput {
  shortLink: string;
}

interface FindLinkByShortLinkOutput {
  id: string;
  link: string;
  shortLink: string;
  createdAt: Date;
  updatedAt: Date;
}

export const findLinkByShortLink = async (
  input: FindLinkByShortLinkInput
): Promise<FindLinkByShortLinkOutput> => {
  const link = await LinkShorterRepository.findByShortLink(
    `${env.BASE_URL}/${input.shortLink}`
  );

  if (!link) {
    throw new LinkNotFoundError();
  }

  return link;
};
