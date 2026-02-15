import { findLinkByShortLink } from '../../use-case/find-link-by-short-link.use-case';
import { LinkNotFoundError } from '../../errors';
import { LinkShorterRepository } from '../../repository/link-shorter.repository';


// Mock do repository
jest.mock('../../repository/link-shorter.repository');

const mockRepository = LinkShorterRepository as jest.Mocked<
  typeof LinkShorterRepository
>;

describe('findLinkByShortLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return link when found', async () => {
    // Arrange
    const mockLink = {
      id: '123',
      link: 'https://example.com',
      shortLink: 'abc123',
      createdAt: new Date(),
      updatedAt: new Date(),
      accessCount: 0,
    };

    mockRepository.findByShortLink.mockResolvedValue(mockLink);

    // Act
    const result = await findLinkByShortLink({ shortLink: 'abc123' });

    // Assert
    expect(result).toEqual(mockLink);
    expect(mockRepository.findByShortLink).toHaveBeenCalledWith(
      'abc123'
    );
    expect(mockRepository.findByShortLink).toHaveBeenCalledTimes(1);
  });

  it('should throw LinkNotFoundError when link is not found', async () => {
    // Arrange
    mockRepository.findByShortLink.mockResolvedValue(null);

    // Act & Assert
    await expect(
      findLinkByShortLink({ shortLink: 'nonexistent' })
    ).rejects.toThrow(LinkNotFoundError);

    expect(mockRepository.findByShortLink).toHaveBeenCalledWith(
      'nonexistent'
    );
    expect(mockRepository.findByShortLink).toHaveBeenCalledTimes(1);
  });

  it('should throw LinkNotFoundError with correct message', async () => {
    // Arrange
    mockRepository.findByShortLink.mockResolvedValue(null);

    // Act & Assert
    await expect(
      findLinkByShortLink({ shortLink: 'nonexistent' })
    ).rejects.toThrow('Link não encontrado');
  });

  it('should throw LinkNotFoundError with status code 404', async () => {
    // Arrange
    mockRepository.findByShortLink.mockResolvedValue(null);

    // Act & Assert
    try {
      await findLinkByShortLink({ shortLink: 'nonexistent' });
      fail('Should have thrown LinkNotFoundError');
    } catch (error) {
      expect(error).toBeInstanceOf(LinkNotFoundError);
      if (error instanceof LinkNotFoundError) {
        expect(error.statusCode).toBe(404);
      }
    }
  });
});
