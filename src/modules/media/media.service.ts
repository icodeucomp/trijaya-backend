import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Media, Prisma } from '@prisma/client';

import { PrismaService } from '@shared/prisma/prisma.service';
import { OrderBy } from '@common/enums';
import { GetData } from '@common/interfaces';
import {
  generateDateRange,
  generatePagination,
  generateReadableDateTime,
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

  async getAllMedia(query: GetMediaDto): Promise<GetData<Media[]>> {
    const { title, uploadedBy, dateStart, dateEnd, sort, order, page, limit } =
      query;
    const { skip, take } = generatePagination(page, limit);

    const { start: dateStarted } = generateDateRange(dateStart);
    const { end: dateEnded } = generateDateRange(dateEnd);

    const whereCondition: any = {
      ...(title && { name: { contains: title, mode: 'insensitive' } }),
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
    };

    const [media, total, newest] = await this.prisma.$transaction([
      this.prisma.media.findMany({
        where: whereCondition,
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
      }),
      this.prisma.media.count({
        where: whereCondition,
      }),
      this.prisma.media.findFirst({
        where: whereCondition,
        orderBy: {
          uploadedAt: OrderBy.Desc,
        },
        select: {
          uploadedAt: true,
        },
      }),
    ]);

    return {
      total,
      data: media,
      newest: generateReadableDateTime(newest?.uploadedAt),
    };
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
    dtos: CreateMediaDto[] | CreateMediaDto,
  ): Promise<Prisma.BatchPayload | Media> {
    try {
      if (!Array.isArray(dtos)) {
        const slug = generateSlug(dtos.name);
        const media = await this.prisma.media.create({
          data: {
            name: dtos.name,
            slug,
            url: dtos.url,
            size: dtos.size,
            uploaderId,
          },
        });

        return media;
      }

      const mediaData = await Promise.all(
        dtos.map(async (dto) => {
          const slug = generateSlug(dto.name);
          return {
            name: dto.name,
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
          skipDuplicates: true,
        });
      });

      if (media.count === 0) {
        throw new BadRequestException('Duplicated media name');
      }

      return media;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Duplicated media title');
        }
      }
      throw error;
    }
  }

  async updateMediaBySlug(
    mediaSlug: string,
    uploaderId: number,
    dto: UpdateMediaDto,
  ) {
    try {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Duplicated media title');
        }
      }
      throw error;
    }
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
