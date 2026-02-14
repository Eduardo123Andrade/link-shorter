import { LinkAccessRepository } from '../repository';

interface RegisterLinkAccessInput {
  linkId: string;
}

export const registerLinkAccess = async ({
  linkId,
}: RegisterLinkAccessInput): Promise<any> => {
  return await LinkAccessRepository.create(linkId);
};
