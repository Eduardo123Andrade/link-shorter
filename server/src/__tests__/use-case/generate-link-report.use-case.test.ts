import { LinkShorterRepository } from '../../repository/link-shorter.repository';
import { storageService } from '../../lib/storage';
import { generateLinkReport } from '../../use-case/generate-link-report.use-case';

jest.mock('../../repository/link-shorter.repository');
jest.mock('../../lib/storage', () => ({
  storageService: {
    upload: jest.fn(),
  },
}));

const mockRepository = LinkShorterRepository as jest.Mocked<typeof LinkShorterRepository>;
const mockUpload = storageService.upload as jest.MockedFunction<typeof storageService.upload>;

const makeLink = (overrides: Partial<{
  id: string;
  link: string;
  shortLink: string;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
}> = {}) => ({
  id: 'id-1',
  link: 'https://example.com',
  shortLink: 'abc123',
  accessCount: 5,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-02T00:00:00.000Z'),
  ...overrides,
});

describe('generateLinkReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpload.mockResolvedValue('http://localhost:3333/tmp/reports/uuid.csv');
  });

  describe('CSV generation', () => {
    it('should return URL from storage service', async () => {
      mockRepository.listBatch.mockResolvedValueOnce([]);

      const result = await generateLinkReport();

      expect(result).toEqual({ url: 'http://localhost:3333/tmp/reports/uuid.csv' });
    });

    it('should include CSV header in upload', async () => {
      mockRepository.listBatch.mockResolvedValueOnce([]);

      await generateLinkReport();

      const uploadedBody = mockUpload.mock.calls[0][1] as string;
      expect(uploadedBody.split('\n')[0]).toBe(
        'id,link,shortLink,accessCount,createdAt,updatedAt'
      );
    });

    it('should format each link row correctly', async () => {
      const link = makeLink({
        id: 'abc-123',
        link: 'https://google.com',
        shortLink: 'goo',
        accessCount: 10,
        createdAt: new Date('2024-06-01T12:00:00.000Z'),
        updatedAt: new Date('2024-06-02T12:00:00.000Z'),
      });
      // Single item batch: loop exits after 1 call (1 < BATCH_SIZE), no 2nd mock needed
      mockRepository.listBatch.mockResolvedValueOnce([link]);

      await generateLinkReport();

      const uploadedBody = mockUpload.mock.calls[0][1] as string;
      const rows = uploadedBody.split('\n');
      expect(rows[1]).toBe(
        '"abc-123","https://google.com","goo",10,"2024-06-01T12:00:00.000Z","2024-06-02T12:00:00.000Z"'
      );
    });

    it('should generate only header when table is empty', async () => {
      mockRepository.listBatch.mockResolvedValueOnce([]);

      await generateLinkReport();

      const uploadedBody = mockUpload.mock.calls[0][1] as string;
      const rows = uploadedBody.split('\n').filter(Boolean);
      expect(rows).toHaveLength(1);
    });
  });

  describe('cursor-based pagination', () => {
    it('should stop after single batch smaller than limit', async () => {
      mockRepository.listBatch.mockResolvedValueOnce([makeLink({ id: 'id-1' })]);

      await generateLinkReport();

      expect(mockRepository.listBatch).toHaveBeenCalledTimes(1);
    });

    it('should request batches of 100 items', async () => {
      mockRepository.listBatch.mockResolvedValueOnce([]);

      await generateLinkReport();

      expect(mockRepository.listBatch).toHaveBeenCalledWith(undefined, 100);
    });

    it('should pass cursor from last item of previous batch', async () => {
      const firstBatch = Array.from({ length: 100 }, (_, i) => makeLink({ id: `id-${i}` }));
      mockRepository.listBatch
        .mockResolvedValueOnce(firstBatch)
        .mockResolvedValueOnce([]);

      await generateLinkReport();

      expect(mockRepository.listBatch).toHaveBeenNthCalledWith(1, undefined, 100);
      expect(mockRepository.listBatch).toHaveBeenNthCalledWith(2, 'id-99', 100);
    });

    it('should include all rows from multiple batches in CSV', async () => {
      const batch1 = Array.from({ length: 100 }, (_, i) => makeLink({ id: `id-${i}` }));
      const batch2 = [makeLink({ id: 'id-100' })];

      mockRepository.listBatch
        .mockResolvedValueOnce(batch1)
        .mockResolvedValueOnce(batch2)
        .mockResolvedValue([]);

      await generateLinkReport();

      const uploadedBody = mockUpload.mock.calls[0][1] as string;
      const dataRows = uploadedBody.split('\n').slice(1).filter(Boolean);
      expect(dataRows).toHaveLength(101);
    });
  });

  describe('storage upload', () => {
    it('should upload with text/csv content type', async () => {
      mockRepository.listBatch.mockResolvedValueOnce([]);

      await generateLinkReport();

      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringMatching(/^reports\/.+\.csv$/),
        expect.any(String),
        expect.objectContaining({ contentType: 'text/csv' })
      );
    });

    it('should upload with attachment content disposition', async () => {
      mockRepository.listBatch.mockResolvedValueOnce([]);

      await generateLinkReport();

      expect(mockUpload).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          contentDisposition: 'attachment; filename="links-report.csv"',
        })
      );
    });

    it('should generate a unique key for each report', async () => {
      mockRepository.listBatch
        .mockResolvedValue([]);

      await generateLinkReport();
      await generateLinkReport();

      const key1 = mockUpload.mock.calls[0][0];
      const key2 = mockUpload.mock.calls[1][0];
      expect(key1).not.toBe(key2);
    });
  });
});
