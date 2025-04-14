import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { GcpService } from '../gcp.service';

@Injectable()
export class StorageService {
  private storage: Storage;

  constructor(private readonly gcpService: GcpService) {
    this.storage = new Storage({
      projectId: this.gcpService.getProjectId(),
      credentials: this.gcpService.getCredentials(),
    });
  }

  async uploadFile(
    bucketName: string,
    fileName: string,
    file: Buffer,
  ): Promise<string> {
    const bucket = this.storage.bucket(bucketName);
    const blob = bucket.file(fileName);

    await blob.save(file);
    return blob.publicUrl();
  }

  async downloadFile(bucketName: string, fileName: string): Promise<Buffer> {
    const bucket = this.storage.bucket(bucketName);
    const blob = bucket.file(fileName);
    const [fileContent] = await blob.download();
    return fileContent;
  }

  async deleteFile(bucketName: string, fileName: string): Promise<void> {
    const bucket = this.storage.bucket(bucketName);
    const blob = bucket.file(fileName);
    await blob.delete();
  }

  async listFiles(bucketName: string, prefix?: string): Promise<string[]> {
    const bucket = this.storage.bucket(bucketName);
    const [files] = await bucket.getFiles({ prefix });
    return files.map(file => file.name);
  }

  async createBucket(bucketName: string): Promise<void> {
    await this.storage.createBucket(bucketName);
  }

  async deleteBucket(bucketName: string): Promise<void> {
    const bucket = this.storage.bucket(bucketName);
    await bucket.delete();
  }
}
