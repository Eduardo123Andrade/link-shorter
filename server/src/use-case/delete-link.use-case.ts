import { LinkShorterRepository } from '../repository';

interface DeleteLinkInput {
  id: string;
}

interface DeleteLinkOutput {
  id: string;
  link: string;
  shortLink: string;
  createdAt: Date;
  updatedAt: Date;
}

export const deleteLink = async (
  input: DeleteLinkInput
): Promise<DeleteLinkOutput> => {
  const deletedLink = await LinkShorterRepository.deleteById(input.id);

  return deletedLink;
};
