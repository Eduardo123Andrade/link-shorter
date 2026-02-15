import { createLink } from '../create-link.use-case';
import { LinkShorterRepository } from '../../repository/link-shorter.repository';
import { LinkAlreadyExistsError } from '../../errors';
import { generateUuid } from '../../utils';

jest.mock('../../repository/link-shorter.repository');
jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  generateUuid: jest.fn(),
}));

describe('createLink use case', () => {
  const mockSave = LinkShorterRepository.save as jest.MockedFunction<
    typeof LinkShorterRepository.save
  >;
  const mockFindByShortLink = LinkShorterRepository.findByShortLink as jest.MockedFunction<
    typeof LinkShorterRepository.findByShortLink
  >;
  const mockGenerateUuid = generateUuid as jest.MockedFunction<typeof generateUuid>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a link successfully when protocol is present', async () => {
    // Arrange
    const input = {
      link: 'https://google.com',
      shortLink: 'google',
    };
    const mockId = 'uuid-v7';
    const mockSavedLink = {
      id: mockId,
      link: input.link,
      shortLink: input.shortLink,
      createdAt: new Date(),
      updatedAt: new Date(),
      accessCount: 0,
    };

    mockFindByShortLink.mockResolvedValue(null);
    mockGenerateUuid.mockReturnValue(mockId);
    mockSave.mockResolvedValue(mockSavedLink as any);

    // Act
    const result = await createLink(input);

    // Assert
    expect(mockFindByShortLink).toHaveBeenCalledWith(input.shortLink);
    expect(mockSave).toHaveBeenCalledWith({
      id: mockId,
      link: input.link,
      shortLink: input.shortLink,
    });
    expect(result).toEqual(mockSavedLink);
  });

  it('should prepend http:// when protocol is missing', async () => {
    // Arrange
    const input = {
      link: 'google.com',
      shortLink: 'google',
    };
    const mockId = 'uuid-v7';
    const expectedLink = 'http://google.com';
    const mockSavedLink = {
      id: mockId,
      link: expectedLink,
      shortLink: input.shortLink,
      createdAt: new Date(),
      updatedAt: new Date(),
      accessCount: 0,
    };

    mockFindByShortLink.mockResolvedValue(null);
    mockGenerateUuid.mockReturnValue(mockId);
    mockSave.mockResolvedValue(mockSavedLink as any);

    // Act
    const result = await createLink(input);

    // Assert
    expect(mockSave).toHaveBeenCalledWith({
      id: mockId,
      link: expectedLink,
      shortLink: input.shortLink,
    });
    expect(result.link).toBe(expectedLink);
  });

  it('should throw LinkAlreadyExistsError when shortLink already exists', async () => {
    // Arrange
    const input = {
      link: 'https://google.com',
      shortLink: 'google',
    };
    const existingLink = {
      id: 'existing-id',
      link: 'https://other.com',
      shortLink: input.shortLink,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockFindByShortLink.mockResolvedValue(existingLink as any);

    // Act & Assert
    await expect(createLink(input)).rejects.toThrow(LinkAlreadyExistsError);
    expect(mockSave).not.toHaveBeenCalled();
  });
});
