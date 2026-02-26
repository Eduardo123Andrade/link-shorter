export interface UploadOptions {
  contentType: string;
  contentDisposition?: string;
}

export interface IStorageService {
  upload(key: string, body: string | Buffer, options: UploadOptions): Promise<string>;
}
