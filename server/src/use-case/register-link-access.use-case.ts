import { LinkShorterRepository } from '../repository';

interface RegisterLinkAccessInput {
  linkId: string;
}

export const registerLinkAccess = async ({
  linkId,
}: RegisterLinkAccessInput): Promise<any> => {
  return await LinkShorterRepository.incrementAccess(linkId);
};
