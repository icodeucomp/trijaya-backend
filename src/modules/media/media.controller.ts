import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { GetUser, Public } from '@common/decorators';
import { JwtGuard } from '@common/guards';
import { successResponsePayload } from '@common/utils';
import {
  CreateMediaDto,
  GetMediaDto,
  UpdateMediaDto,
} from '@modules/media/dtos';
import { MediaService } from '@modules/media/media.service';

@UseGuards(JwtGuard)
@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Public()
  @Get()
  async getAllMedia(@Query() query: GetMediaDto) {
    const { total, data, newest } = await this.mediaService.getAllMedia(query);

    return successResponsePayload('Get all media', data, total, newest);
  }

  @Public()
  @Get(':mediaSlug')
  async getMediaBySlug(@Param('mediaSlug') mediaSlug: string) {
    const media = await this.mediaService.getMediaBySlug(mediaSlug);

    return successResponsePayload(`Get media by slug ${mediaSlug}`, media);
  }

  @Post()
  async createMedia(
    @GetUser('id') uploaderId: number,
    @Body() dtos: CreateMediaDto[],
  ) {
    const media = await this.mediaService.createMedia(uploaderId, dtos);

    return successResponsePayload('Create media', media);
  }

  @Patch(':mediaSlug')
  async updateMediaBySlug(
    @GetUser('id') uploaderId: number,
    @Param('mediaSlug') mediaSlug: string,
    @Body() dto: UpdateMediaDto,
  ) {
    const media = await this.mediaService.updateMediaBySlug(
      mediaSlug,
      uploaderId,
      dto,
    );

    return successResponsePayload(`Update media by slug ${mediaSlug}`, media);
  }

  @Delete(':mediaSlug')
  async deleteMediaBySlug(@Param('mediaSlug') mediaSlug: string) {
    const media = await this.mediaService.deleteMediaBySlug(mediaSlug);

    return successResponsePayload(`Delete media by slug ${mediaSlug}`, media);
  }
}
