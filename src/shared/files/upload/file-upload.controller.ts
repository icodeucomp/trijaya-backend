import {
  Controller,
  ParseEnumPipe,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { BusinessSlug, BusinessType, MediaType } from '@common/enums';
import { JwtGuard } from '@common/guards';
import { maxSize, maxUpload, storage } from '@common/utils';
import { FileUploadService } from '@shared/files/upload/file-upload.service';

@UseGuards(JwtGuard)
@Controller('upload')
export class FileUploadController {
  constructor(private fileUpload: FileUploadService) {}

  // Upload Blog Media, Document & insert/update business header photo (single upload)
  @Post()
  @UseInterceptors(
    FileInterceptor('upload', { storage, limits: { fileSize: maxSize } }),
  )
  async uploadFile(
    @Query('type', new ParseEnumPipe(MediaType, { optional: true }))
    type: MediaType,
    @Query('category')
    category: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string; size: string }> {
    const url = this.fileUpload.uploadFile(file, type, category);

    return url;
  }

  // upload media for projects, products, service (multiple upload, max 10 per request)
  @Post('media')
  @UseInterceptors(
    FilesInterceptor('uploads', maxUpload, {
      storage,
      limits: { fileSize: maxSize },
    }),
  )
  async uploadFiles(
    @Query('business', new ParseEnumPipe(BusinessSlug, { optional: true }))
    businessSlug: BusinessSlug,
    @Query('type', new ParseEnumPipe(BusinessType, { optional: true }))
    type: BusinessType,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ uploadedFiles: { name: string; url: string; size: string }[] }> {
    const urls = await this.fileUpload.uploadFiles(files, businessSlug, type);

    return urls;
  }
}
