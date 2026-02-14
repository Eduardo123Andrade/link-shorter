import { listAllLinksController } from '../list-all-links.controller';
import { mockRequest, mockReply } from './helpers';
import { HttpStatus, env } from '../../utils';

jest.mock('../../use-case', () => ({
  listAllLinks: jest.fn(),
}));

import { listAllLinks } from '../../use-case';

const mockListAllLinks = listAllLinks as jest.MockedFunction<
  typeof listAllLinks
>;

describe('listAllLinksController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 with all links', async () => {
    const request = mockRequest();
    const reply = mockReply();

    const mockLinks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        link: 'https://example.com',
        shortLink: 'abc123',
        createdAt: new Date(),
        updatedAt: new Date(),
        accessCount: 0,
      },
    ];

    mockListAllLinks.mockResolvedValue(mockLinks);

    await listAllLinksController(request, reply);

    expect(mockListAllLinks).toHaveBeenCalled();
    expect(reply.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(reply.send).toHaveBeenCalledWith(
      mockLinks.map((link) => ({
        ...link,
        shortLink: `${env.BASE_URL}/${link.shortLink}`,
      }))
    );
  });

  it('should return 200 with empty array when no links exist', async () => {
    const request = mockRequest();
    const reply = mockReply();

    mockListAllLinks.mockResolvedValue([]);

    await listAllLinksController(request, reply);

    expect(reply.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(reply.send).toHaveBeenCalledWith([]);
  });

  it('should propagate errors from use case', async () => {
    const request = mockRequest();
    const reply = mockReply();

    mockListAllLinks.mockRejectedValue(new Error('Database error'));

    await expect(listAllLinksController(request, reply)).rejects.toThrow(
      'Database error'
    );
  });
});
