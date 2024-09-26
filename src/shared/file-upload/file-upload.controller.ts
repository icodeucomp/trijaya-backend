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

import { GetUser } from '@common/decorators';
import { BusinessSlug, BusinessType, MediaType } from '@common/enums';
import { JwtGuard } from '@common/guards';
import { maxSize, maxUpload, storage } from '@common/utils';
import { FileUploadService } from '@shared/file-upload/file-upload.service';

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
    @GetUser('id') uploaderId: number,
    @Query('type', new ParseEnumPipe(MediaType)) type: MediaType,
    @Query('category')
    category: string, // set category for business or document
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string; size: string }> {
    const url = this.fileUpload.uploadFile(uploaderId, file, type, category);

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
    @GetUser('id') uploaderId: number,
    @Query('business', new ParseEnumPipe(BusinessSlug))
    businessSlug: BusinessSlug,
    @Query('type', new ParseEnumPipe(BusinessType)) type: BusinessType,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ uploadedFiles: { url: string; size: string }[] }> {
    const folderName = `media/business/${businessSlug}/${type}`;

    const urls = await this.fileUpload.uploadFiles(
      uploaderId,
      files,
      folderName,
    );

    return urls;
  }
}
