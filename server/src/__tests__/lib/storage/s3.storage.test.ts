import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3StorageService } from '../../../lib/storage/s3.storage';

const mockSend = jest.fn();

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: mockSend })),
  PutObjectCommand: jest.fn().mockImplementation((input) => input),
}));

jest.mock('../../../utils/env', () => ({
  env: {
    AWS_REGION: 'us-east-1',
    REPORTS_BUCKET_NAME: 'test-bucket',
    CLOUDFRONT_REPORTS_URL: 'https://test.cloudfront.net',
  },
}));

describe('S3StorageService', () => {
  let service: S3StorageService;

  beforeEach(() => {
    mockSend.mockResolvedValue({});
    jest.clearAllMocks();
    service = new S3StorageService();
  });

  describe('constructor', () => {
    it('should create S3Client with configured region', () => {
      expect(S3Client).toHaveBeenCalledWith({ region: 'us-east-1' });
    });
  });

  describe('upload', () => {
    it('should call PutObjectCommand with correct params', async () => {
      const key = 'reports/test.csv';
      const body = 'id,link\n"1","https://example.com"';
      const options = {
        contentType: 'text/csv',
        contentDisposition: 'attachment; filename="test.csv"',
      };

      await service.upload(key, body, options);

      expect(PutObjectCommand).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: key,
        Body: body,
        ContentType: 'text/csv',
        ContentDisposition: 'attachment; filename="test.csv"',
      });
    });

    it('should send command to S3 client', async () => {
      await service.upload('reports/test.csv', 'content', { contentType: 'text/csv' });

      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should return CloudFront URL for the uploaded key', async () => {
      const url = await service.upload('reports/uuid.csv', 'data', { contentType: 'text/csv' });

      expect(url).toBe('https://test.cloudfront.net/reports/uuid.csv');
    });

    it('should work without optional contentDisposition', async () => {
      const url = await service.upload('reports/test.csv', 'data', { contentType: 'text/csv' });

      expect(url).toBeDefined();
      expect(mockSend).toHaveBeenCalledTimes(1);
    });
  });
});
