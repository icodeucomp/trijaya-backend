import { Module } from '@nestjs/common';

import { AlbumsController } from '@modules/albums/albums.controller';
import { AlbumsService } from '@modules/albums/albums.service';
import { MediaModule } from '@modules/albums/media/media.module';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService],
  imports: [MediaModule],
})
export class AlbumsModule {}
