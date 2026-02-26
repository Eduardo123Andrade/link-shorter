import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../../utils/env';
import type { IStorageService, UploadOptions } from './storage.interface';

export class S3StorageService implements IStorageService {
  private client: S3Client;

  constructor() {
    if (!env.REPORTS_BUCKET_NAME || !env.CLOUDFRONT_REPORTS_URL) {
      throw new Error(
        'S3 storage requires REPORTS_BUCKET_NAME and CLOUDFRONT_REPORTS_URL env vars'
      );
    }
    this.client = new S3Client({ region: env.AWS_REGION });
  }

  async upload(key: string, body: string | Buffer, options: UploadOptions): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: env.REPORTS_BUCKET_NAME!,
        Key: key,
        Body: body,
        ContentType: options.contentType,
        ContentDisposition: options.contentDisposition,
      })
    );

    return `${env.CLOUDFRONT_REPORTS_URL}/${key}`;
  }
}
