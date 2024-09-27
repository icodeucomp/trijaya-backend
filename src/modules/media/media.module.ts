import { Module } from '@nestjs/common';
import { MediaController } from '@modules/media/media.controller';
import { MediaService } from '@modules/media/media.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
