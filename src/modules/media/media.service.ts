import { Injectable, NotFoundException } from '@nestjs/common';
import { Media, Prisma } from '@prisma/client';

import { PrismaService } from '@shared/prisma/prisma.service';
import {
  generateDateRange,
  generatePagination,
  generateSlug,
} from '@common/utils';
import {
  CreateMediaDto,
  GetMediaDto,
  UpdateMediaDto,
} from '@modules/media/dtos';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async getAllMedia(query: GetMediaDto): Promise<Media[]> {
    const { name, uploadedBy, dateStart, dateEnd, sort, order, page, limit } =
      query;
    const { skip, take } = generatePagination(page, limit);

    const { start: dateStarted } = generateDateRange(dateStart);
    const { end: dateEnded } = generateDateRange(dateEnd);

    const medias = this.prisma.media.findMany({
      where: {
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
        ...(uploadedBy && {
          uploaderId: Number(uploadedBy),
        }),
        ...(dateStart &&
          dateEnd && {
            uploadedAt: {
              gte: dateStarted,
              lt: dateEnded,
            },
          }),
      },
      include: {
        uploader: {
          select: {
            username: true,
          },
        },
      },
      orderBy: { [sort]: order },
      skip,
      take,
    });

    return medias;
  }

  async getMediaBySlug(mediaSlug: string): Promise<Media> {
    const media = await this.prisma.media.findFirst({
      where: {
        slug: mediaSlug,
      },
      include: {
        uploader: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return media;
  }

  async createMedia(
    uploaderId: number,
    dtos: CreateMediaDto[],
  ): Promise<Prisma.BatchPayload> {
    const mediaData = await Promise.all(
      dtos.map(async (dto) => {
        const name = await this.generateMediaName(dto.name);
        const slug = generateSlug(name);
        return {
          name,
          slug,
          url: dto.url,
          size: dto.size,
          uploaderId,
        };
      }),
    );

    const media = await this.prisma.$transaction(async (prisma) => {
      return await prisma.media.createMany({
        data: mediaData,
      });
    });

    return media;
  }

  async updateMediaBySlug(
    mediaSlug: string,
    uploaderId: number,
    dto: UpdateMediaDto,
  ) {
    const existingMedia = await this.getMediaBySlug(mediaSlug);

    const updatedData: UpdateMediaDto = { ...dto };
    updatedData.uploaderId = uploaderId;

    if (dto.name) {
      updatedData.name = await this.generateMediaName(dto.name);
      updatedData.slug = generateSlug(updatedData.name);
    }

    const media = await this.prisma.media.update({
      where: {
        id: existingMedia.id,
      },
      data: updatedData,
    });

    return media;
  }

  async deleteMediaBySlug(mediaSlug: string): Promise<Media> {
    const existingMedia = await this.getMediaBySlug(mediaSlug);

    const media = await this.prisma.media.delete({
      where: {
        id: existingMedia.id,
      },
    });

    return media;
  }

  private async generateMediaName(name: string): Promise<string> {
    let duplicateCount = 0;
    let mediaName = name;

    while (await this.prisma.media.findFirst({ where: { name: mediaName } })) {
      duplicateCount++;
      mediaName = `${name}(${duplicateCount})`;
    }

    return mediaName;
  }
}
