import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Service } from '@prisma/client';

import { PrismaService } from '@shared/prisma/prisma.service';
import { OrderBy } from '@common/enums';
import { GetData, MediaData } from '@common/interfaces';
import {
  generateDateRange,
  generatePagination,
  generateReadableDateTime,
  generateSlug,
} from '@common/utils';
import {
  CreateServiceDto,
  GetServiceDto,
  UpdateServiceDto,
} from '@modules/business/services/dtos';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async getAllService(query: GetServiceDto): Promise<GetData<Service[]>> {
    const { title, dateStart, dateEnd, sort, order, page, limit } = query;
    const { skip, take } = generatePagination(page, limit);

    const { start: dateStarted } = generateDateRange(dateStart);
    const { end: dateEnded } = generateDateRange(dateEnd);

    const whereCondition: any = {
      ...(title && { title: { contains: title, mode: 'insensitive' } }),
      ...(dateStart &&
        dateEnd && {
          updatedAt: {
            gte: dateStarted,
            lt: dateEnded,
          },
        }),
    };

    const [services, total, newest] = await this.prisma.$transaction([
      this.prisma.service.findMany({
        where: whereCondition,
        include: {
          business: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { [sort]: order },
        skip,
        take,
      }),
      this.prisma.service.count({
        where: whereCondition,
      }),
      this.prisma.service.findFirst({
        where: whereCondition,
        orderBy: {
          updatedAt: OrderBy.Desc,
        },
        select: {
          updatedAt: true,
        },
      }),
    ]);

    return {
      total,
      data: services,
      newest: generateReadableDateTime(newest?.updatedAt),
    };
  }

  async getServiceBySlug(serviceSlug: string): Promise<Service> {
    const service = await this.prisma.service.findFirst({
      where: {
        slug: serviceSlug,
      },
      include: {
        business: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async createService(dto: CreateServiceDto): Promise<Service> {
    const slug = generateSlug(dto.title);

    try {
      if (dto.media) {
        dto.media = await this.validateServiceMedia(null, dto.media);
      }

      const service = await this.prisma.service.create({
        data: {
          title: dto.title,
          slug,
          description: dto.description,
          media: dto.media as unknown as Prisma.InputJsonValue[],
          businessId: dto.businessId,
        },
      });

      return service;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Duplicated service title');
        }
      }
      throw error;
    }
  }

  async updateServiceBySlug(serviceslug: string, dto: UpdateServiceDto) {
    const existingService = await this.getServiceBySlug(serviceslug);

    const updatedData: UpdateServiceDto = { ...dto };

    try {
      if (dto.title) {
        updatedData.slug = generateSlug(updatedData.title);
      }

      if (dto.media) {
        dto.media = await this.validateServiceMedia(
          existingService.id,
          dto.media,
        );
      }

      const service = await this.prisma.service.update({
        where: {
          id: existingService.id,
        },
        data: {
          ...updatedData,
          media: updatedData.media as unknown as Prisma.InputJsonValue[],
        },
      });

      return service;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Duplicated service title');
        }
      }
      throw error;
    }
  }

  async deleteServiceBySlug(serviceslug: string): Promise<Service> {
    const existingService = await this.getServiceBySlug(serviceslug);

    const service = await this.prisma.service.delete({
      where: {
        id: existingService.id,
      },
    });

    return service;
  }

  async validateServiceMedia(
    serviceId: number | null,
    media: MediaData[] | null,
  ): Promise<{ slug: string; url: string }[]> | null {
    if (!media || media.length === 0) {
      return null;
    }

    const mediaList: { slug: string; url: string }[] = media.map((item) => ({
      slug: item.slug.toLowerCase(),
      url: item.url,
    }));

    const uniqueSlugs = new Set(mediaList.map((item) => item.slug));
    if (uniqueSlugs.size !== mediaList.length) {
      throw new BadRequestException(
        'Duplicate slugs found in input media array',
      );
    }

    const allProducts = await this.prisma.service.findMany({
      where: serviceId ? { NOT: { id: serviceId } } : {},
      select: {
        id: true,
        media: true,
      },
    });

    for (const newMedia of mediaList) {
      const conflictingProduct = allProducts.find((service) => {
        const serviceMedia = service.media as { slug: string; url: string }[];
        return serviceMedia.some(
          (existingMedia) => existingMedia.slug.toLowerCase() === newMedia.slug,
        );
      });

      if (conflictingProduct) {
        throw new BadRequestException(`Duplicated service media`);
      }
    }

    return mediaList;
  }
}
