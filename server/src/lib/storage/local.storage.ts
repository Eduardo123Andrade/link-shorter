import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { env } from '../../utils/env';
import type { IStorageService, UploadOptions } from './storage.interface';

const TMP_DIR = join(process.cwd(), 'tmp');

export class LocalStorageService implements IStorageService {
  async upload(key: string, body: string | Buffer, _options: UploadOptions): Promise<string> {
    const filePath = join(TMP_DIR, key);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, body);

    const host = env.HOST === '0.0.0.0' ? 'localhost' : env.HOST;
    return `http://${host}:${env.PORT}/tmp/${key}`;
  }
}
