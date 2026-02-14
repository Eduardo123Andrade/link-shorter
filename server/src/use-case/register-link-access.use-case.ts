import { LinkAccessRepository } from '../repository';

interface RegisterLinkAccessInput {
  linkId: string;
}

export const registerLinkAccess = async ({
  linkId,
}: RegisterLinkAccessInput): Promise<void> => {
  await LinkAccessRepository.create(linkId);
};
