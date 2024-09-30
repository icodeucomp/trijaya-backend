import { Injectable, NotFoundException } from '@nestjs/common';
import { Business } from '@prisma/client';

import { PrismaService } from '@shared/prisma/prisma.service';
import {
  generateDateRange,
  generatePagination,
  generateSlug,
} from '@common/utils';
import {
  CreateBusinessDto,
  GetBusinessDto,
  UpdateBusinessDto,
} from '@modules/business/dtos';
import { BusinessMetadata } from '@common/interfaces';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  async getAllBusinessMetadata(): Promise<BusinessMetadata[]> {
    const business = await this.prisma.business.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    return business;
  }

  async getAllBusiness(query: GetBusinessDto): Promise<Business[]> {
    const { title, dateStart, dateEnd, sort, order, page, limit } = query;
    const { skip, take } = generatePagination(page, limit);

    const { start: dateStarted } = generateDateRange(dateStart);
    const { end: dateEnded } = generateDateRange(dateEnd);

    const businesss = this.prisma.business.findMany({
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
        Project: {
          include: {
            business: {
              select: {
                title: true,
              },
            },
          },
        },
        Product: {
          include: {
            business: {
              select: {
                title: true,
              },
            },
          },
        },
        Service: {
          include: {
            business: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: { [sort]: order },
      skip,
      take,
    });

    return businesss;
  }

  async getBusinessBySlug(businessSlug: string): Promise<Business> {
    const business = await this.prisma.business.findFirst({
      where: {
        slug: businessSlug,
      },
      include: {
        Project: {
          include: {
            business: {
              select: {
                title: true,
              },
            },
          },
        },
        Product: {
          include: {
            business: {
              select: {
                title: true,
              },
            },
          },
        },
        Service: {
          include: {
            business: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  async createBusiness(dto: CreateBusinessDto): Promise<Business> {
    const slug = generateSlug(dto.title);

    const business = await this.prisma.business.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        imageHeaderUrl: dto.imageHeaderUrl,
        productHeaderUrl: dto.productHeaderUrl,
      },
    });

    return business;
  }

  async updateBusinessBySlug(
    businessslug: string,
    dto: UpdateBusinessDto,
  ): Promise<Business> {
    const existingBusiness = await this.getBusinessBySlug(businessslug);

    const updatedData: UpdateBusinessDto = { ...dto };

    if (dto.title) {
      updatedData.slug = generateSlug(updatedData.title);
    }

    const business = await this.prisma.business.update({
      where: {
        id: existingBusiness.id,
      },
      data: updatedData,
    });

    return business;
  }

  async deleteBusinessBySlug(businessslug: string): Promise<Business> {
    const existingBusiness = await this.getBusinessBySlug(businessslug);

    const business = await this.prisma.business.delete({
      where: {
        id: existingBusiness.id,
      },
    });

    return business;
  }
}
