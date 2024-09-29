import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { FileDownloadService } from './file-download.service';
import { Readable } from 'stream';

@Controller('download')
export class FileDownloadController {
  constructor(private fileDownloadService: FileDownloadService) {}

  @Get()
  async downloadFile(@Query('url') url: string, @Res() res: Response) {
    try {
      const parsedUrl = new URL(url);
      const path = decodeURIComponent(parsedUrl.pathname);

      const fileStream: Readable =
        await this.fileDownloadService.download(path);

      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${path.split('/').pop()}"`,
      });

      fileStream.pipe(res);
    } catch (error) {
      res.status(404).send('File not found or inaccessible');
    }
  }
}
