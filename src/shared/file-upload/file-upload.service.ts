import { Upload } from '@aws-sdk/lib-storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

import { BusinessSlug, MediaType } from '@common/enums';
import { generateFileSize, generateSlug } from '@common/utils';
import { PrismaService } from '@shared/prisma/prisma.service';
import { S3Service } from '@shared/s3/s3.service';

@Injectable()
export class FileUploadService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private s3: S3Service,
  ) {}

  async uploadFile(
    uploaderId: number,
    file: Express.Multer.File,
    type: MediaType,
    category: BusinessSlug | string,
  ): Promise<{ url: string; size: string }> {
    if (!file) {
      throw new BadRequestException('please input file');
    }

    if (type === MediaType.Business && !this.isValidBusinessSlug(category)) {
      throw new BadRequestException(
        `Upload failed, no business named ${category}`,
      );
    }

    const folderName =
      type === MediaType.Business
        ? `media/${type}/${category}/header`
        : type === MediaType.Document
          ? `${type}/${category}`
          : `media/${type}`;
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

    if (type !== MediaType.Document) {
      await this.prisma.media.create({
        data: {
          name: file.filename,
          slug: generateSlug(file.filename),
          url: objectUrl,
          size: fileSize,
          uploaderId,
        },
      });
    }

    return { url: objectUrl, size: fileSize };
  }

  async uploadFiles(
    uploaderId: number,
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

        await this.prisma.media.create({
          data: {
            name: file.filename,
            slug: generateSlug(file.filename),
            url: objectUrl,
            size: fileSize,
            uploaderId,
          },
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

  private isValidBusinessSlug(businessSlug: string): boolean {
    return Object.values(BusinessSlug).includes(businessSlug as BusinessSlug);
  }
}
