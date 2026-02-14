import { deleteLink } from '../delete-link.use-case';
import { LinkShorterRepository } from '../../repository/link-shorter.repository';

jest.mock('../../repository/link-shorter.repository');

describe('deleteLink', () => {
  const mockDeleteById =
    LinkShorterRepository.deleteById as jest.MockedFunction<
      typeof LinkShorterRepository.deleteById
    >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete link and return deleted link data', async () => {
    // Arrange
    const input = { id: '550e8400-e29b-41d4-a716-446655440000' };
    const mockDeletedLink = {
      id: input.id,
      link: 'https://www.example.com/test',
      shortLink: 'test123',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      accessCount: 0,
    };

    mockDeleteById.mockResolvedValue(mockDeletedLink);

    // Act
    const result = await deleteLink(input);

    // Assert
    expect(mockDeleteById).toHaveBeenCalledWith(input.id);
    expect(result).toEqual(mockDeletedLink);
  });

  it('should propagate errors from repository when link not found', async () => {
    // Arrange
    const input = { id: 'non-existent-id' };
    const mockError = new Error('Record not found');
    mockDeleteById.mockRejectedValue(mockError);

    // Act & Assert
    await expect(deleteLink(input)).rejects.toThrow('Record not found');
  });

  it('should propagate errors from repository', async () => {
    // Arrange
    const input = { id: 'test-id' };
    const mockError = new Error('Database error');
    mockDeleteById.mockRejectedValue(mockError);

    // Act & Assert
    await expect(deleteLink(input)).rejects.toThrow('Database error');
  });
});
