import { Injectable, NotFoundException } from '@nestjs/common';
import { Service } from '@prisma/client';

import { PrismaService } from '@shared/prisma/prisma.service';
import {
  generateDateRange,
  generatePagination,
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

  async getAllService(query: GetServiceDto): Promise<Service[]> {
    const { title, dateStart, dateEnd, sort, order, page, limit } = query;
    const { skip, take } = generatePagination(page, limit);

    const { start: dateStarted } = generateDateRange(dateStart);
    const { end: dateEnded } = generateDateRange(dateEnd);

    const services = this.prisma.service.findMany({
      where: {
        ...(title && { title: { contains: title, mode: 'insensitive' } }),
        ...(dateStart &&
          dateEnd && {
            updatedAt: {
              gte: dateStarted,
              lt: dateEnded,
            },
          }),
      },
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
    });

    return services;
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

    const service = await this.prisma.service.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        mediaUrls: dto.mediaUrls,
        businessId: dto.businessId,
      },
    });

    return service;
  }

  async updateServiceBySlug(serviceslug: string, dto: UpdateServiceDto) {
    const existingService = await this.getServiceBySlug(serviceslug);

    const updatedData: UpdateServiceDto = { ...dto };

    if (dto.title) {
      updatedData.slug = generateSlug(updatedData.title);
    }

    const service = await this.prisma.service.update({
      where: {
        id: existingService.id,
      },
      data: updatedData,
    });

    return service;
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
}
