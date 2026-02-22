import { registerLinkAccess } from '../register-link-access.use-case';
import { LinkShorterRepository } from '../../repository/link-shorter.repository';

jest.mock('../../repository/link-shorter.repository');

const mockLinkShorterRepository = LinkShorterRepository as jest.Mocked<
  typeof LinkShorterRepository
>;

describe('registerLinkAccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call LinkShorterRepository.incrementAccess with correct linkId', async () => {
    // Arrange
    const linkId = '123';
    mockLinkShorterRepository.incrementAccess.mockResolvedValue({
      id: linkId,
      link: 'https://example.com',
      shortLink: 'abc',
      createdAt: new Date(),
      updatedAt: new Date(),
      accessCount: 1,
    });

    // Act
    await registerLinkAccess({ linkId });

    // Assert
    expect(mockLinkShorterRepository.incrementAccess).toHaveBeenCalledWith(
      linkId
    );
    expect(mockLinkShorterRepository.incrementAccess).toHaveBeenCalledTimes(1);
  });

  it('should propagate errors from repository', async () => {
    // Arrange
    const linkId = '123';
    const error = new Error('Database error');
    mockLinkShorterRepository.incrementAccess.mockRejectedValue(error);

    // Act & Assert
    await expect(registerLinkAccess({ linkId })).rejects.toThrow(error);
  });
});
