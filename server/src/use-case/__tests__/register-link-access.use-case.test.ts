import { registerLinkAccess } from '../register-link-access.use-case';
import { LinkAccessRepository } from '../../repository/link-access.repository';

jest.mock('../../repository/link-access.repository');

const mockAccessRepository = LinkAccessRepository as jest.Mocked<
  typeof LinkAccessRepository
>;

describe('registerLinkAccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call LinkAccessRepository.create with correct linkId', async () => {
    // Arrange
    const linkId = '123';
    mockAccessRepository.create.mockResolvedValue({
      id: 'access-123',
      linkId,
      accessedAt: new Date(),
    });

    // Act
    await registerLinkAccess({ linkId });

    // Assert
    expect(mockAccessRepository.create).toHaveBeenCalledWith(linkId);
    expect(mockAccessRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should propagate errors from repository', async () => {
    // Arrange
    const linkId = '123';
    const error = new Error('Database error');
    mockAccessRepository.create.mockRejectedValue(error);

    // Act & Assert
    await expect(registerLinkAccess({ linkId })).rejects.toThrow(error);
  });
});
