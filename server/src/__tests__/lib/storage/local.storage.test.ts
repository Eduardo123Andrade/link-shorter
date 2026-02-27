import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { LocalStorageService } from '../../../lib/storage/local.storage';

jest.mock('node:fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  writeFile: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../../utils/env', () => ({
  env: {
    HOST: '0.0.0.0',
    PORT: 3333,
  },
}));

const mockMkdir = mkdir as jest.MockedFunction<typeof mkdir>;
const mockWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    service = new LocalStorageService();
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should create parent directory recursively before writing', async () => {
      await service.upload('reports/uuid.csv', 'content', { contentType: 'text/csv' });

      expect(mockMkdir).toHaveBeenCalledWith(
        expect.stringContaining(path.join('tmp', 'reports')),
        { recursive: true }
      );
    });

    it('should write file with the exact body provided', async () => {
      const body = 'id,link\n"1","https://example.com"';

      await service.upload('reports/test.csv', body, { contentType: 'text/csv' });

      expect(mockWriteFile).toHaveBeenCalledWith(
        expect.stringContaining(path.join('tmp', 'reports', 'test.csv')),
        body
      );
    });

    it('should return localhost URL when HOST is 0.0.0.0', async () => {
      const url = await service.upload('reports/abc.csv', 'content', { contentType: 'text/csv' });

      expect(url).toBe('http://localhost:3333/tmp/reports/abc.csv');
    });

    it('should include full key path in returned URL', async () => {
      const key = 'reports/nested/file.csv';

      const url = await service.upload(key, 'data', { contentType: 'text/csv' });

      expect(url).toContain('/tmp/reports/nested/file.csv');
    });

    it('should call mkdir and writeFile exactly once per upload', async () => {
      await service.upload('reports/single.csv', 'data', { contentType: 'text/csv' });

      expect(mockMkdir).toHaveBeenCalledTimes(1);
      expect(mockWriteFile).toHaveBeenCalledTimes(1);
    });
  });
});
