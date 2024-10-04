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

import {
  BusinessSlug,
  BusinessType,
  DocumentCategory,
  MediaType,
} from '@common/enums';
import { JwtGuard } from '@common/guards';
import {
  maxDocumentSize,
  maxImageSize,
  maxUpload,
  storage,
} from '@common/utils';
import { FileUploadService } from '@shared/files/upload/file-upload.service';

@UseGuards(JwtGuard)
@Controller()
export class FileUploadController {
  constructor(private fileUpload: FileUploadService) {}

  @Post('upload/document')
  @UseInterceptors(
    FileInterceptor('upload', {
      storage,
      limits: { fileSize: maxDocumentSize },
    }),
  )
  async uploadDocumentFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('category')
    category: BusinessSlug | DocumentCategory,
  ): Promise<{ url: string; size: string }> {
    const url = this.fileUpload.uploadFile(file, MediaType.Document, category);

    return url;
  }

  // Upload Blog Media, Document & insert/update business header photo (single upload)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('upload', { storage, limits: { fileSize: maxImageSize } }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('type', new ParseEnumPipe(MediaType, { optional: true }))
    type: MediaType,
    @Query('category')
    category: BusinessSlug | DocumentCategory,
  ): Promise<{ url: string; size: string }> {
    const url = this.fileUpload.uploadFile(file, type, category);

    return url;
  }

  // upload media for projects, products, service (multiple upload, max 10 per request)
  @Post('uploads')
  @UseInterceptors(
    FilesInterceptor('uploads', maxUpload, {
      storage,
      limits: { fileSize: maxImageSize },
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('type', new ParseEnumPipe(MediaType, { optional: true }))
    type: MediaType,
    @Query('category', new ParseEnumPipe(BusinessSlug, { optional: true }))
    businessSlug: BusinessSlug,
    @Query('business-type', new ParseEnumPipe(BusinessType, { optional: true }))
    businessType: BusinessType,
  ): Promise<{ uploadedFiles: { name: string; url: string; size: string }[] }> {
    const urls = await this.fileUpload.uploadFiles(
      files,
      type,
      businessSlug,
      businessType,
    );

    return urls;
  }
}