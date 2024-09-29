import { Module } from '@nestjs/common';
import { FileDownloadService } from './file-download.service';
import { FileDownloadController } from './file-download.controller';

@Module({
  providers: [FileDownloadService],
  controllers: [FileDownloadController]
})
export class FileDownloadModule {}
