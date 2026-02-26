import { env } from '../../utils/env';
import { LocalStorageService } from './local.storage';
import { S3StorageService } from './s3.storage';
import type { IStorageService } from './storage.interface';

export type { IStorageService };

function createStorageService(): IStorageService {
  if (env.STORAGE_DRIVER === 's3') {
    return new S3StorageService();
  }
  return new LocalStorageService();
}

export const storageService = createStorageService();
