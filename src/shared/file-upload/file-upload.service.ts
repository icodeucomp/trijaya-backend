import { Upload } from '@aws-sdk/lib-storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

import { S3Service } from '../s3/s3.service';
import { generateFileSize } from 'src/common/utils';

@Injectable()
export class FileUploadService {
  constructor(
    private config: ConfigService,
    private s3: S3Service,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<{ url: string; size: string }> {
    if (!file) {
      throw new BadRequestException('please input file');
    }

    const fileStream = fs.createReadStream(file.path);
    const contentType = file.mimetype || 'application/octet-stream';
    const fileSize = generateFileSize(file.size);

    const upload = new Upload({
      client: this.s3,
      params: {
        ACL: 'public-read',
        Bucket: this.config.get<string>('S3_BUCKET'),
        Key: `${folderName}/${file.filename}`, // File path in S3
        Body: fileStream,
        ContentType: contentType,
      },
    });

    const data = await upload.done();

    const objectUrl = `https://${this.config.get<string>('S3_BUCKET')}.s3.${this.config.get<string>(
      'S3_REGION',
    )}.amazonaws.com/${data.Key}`;

    return { url: objectUrl, size: fileSize };
  }

  async uploadFiles(
    files: Express.Multer.File[],
    folderName: string,
  ): Promise<{ uploadedFiles: { url: string; size: string }[] }> {
    const uploadedFiles = [];

    if (!files) {
      throw new BadRequestException('please input file');
    }

    for (const file of files) {
      const fileStream = fs.createReadStream(file.path);

      if (!fileStream) {
        throw new Error('Failed to create file stream');
      }

      const contentType = file.mimetype || 'application/octet-stream';
      const fileSize = generateFileSize(file.size);

      const upload = new Upload({
        client: this.s3,
        params: {
          ACL: 'public-read',
          Bucket: this.config.get('S3_BUCKET'),
          Key: `${folderName}/${file.filename}`,
          Body: fileStream,
          ContentType: contentType,
        },
        tags: [],
        queueSize: 4,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });

      try {
        const data = await upload.done();
        const objectUrl = `https://${this.config.get('S3_BUCKET')}.s3.${this.config.get('S3_REGION')}.amazonaws.com/${data.Key}`;
        uploadedFiles.push({
          url: objectUrl,
          size: fileSize,
        });
      } catch (error) {
        console.error({ error });
        throw new Error(`Failed to upload file: ${error.message}`);
      } finally {
        fs.unlinkSync(file.path);
      }
    }

    return { uploadedFiles };
  }
}
