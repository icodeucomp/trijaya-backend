import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { FileUploadService } from './file-upload.service';
import { maxSize, maxUpload, storage } from '../../common/utils';

@Controller('upload')
export class FileUploadController {
  constructor(private fileUpload: FileUploadService) {}

  @Post('single')
  @UseInterceptors(
    FileInterceptor('upload', { storage, limits: { fileSize: maxSize } }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string; size: string }> {
    const url = this.fileUpload.uploadFile(file, 'documents');

    return url;
  }

  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('uploads', maxUpload, {
      storage,
      limits: { fileSize: maxSize },
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ uploadedFiles: { url: string; size: string }[] }> {
    const urls = await this.fileUpload.uploadFiles(files, 'documents');

    return urls;
  }
}
