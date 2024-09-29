import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Admin } from '@prisma/client';
import * as argon from 'argon2';

import { PrismaService } from '@shared/prisma/prisma.service';
import { generateDateRange, generatePagination } from '@common/utils';
import {
  CreateAdminDto,
  GetAdminDto,
  UpdateAdminDto,
} from '@modules/admin/dtos';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllAdmin(query: GetAdminDto): Promise<Admin[]> {
    const {
      username,
      email,
      dateCreateStart,
      dateCreateEnd,
      dateUpdateStart,
      dateUpdateEnd,
      sort,
      order,
      page,
      limit,
    } = query;
    const { skip, take } = generatePagination(page, limit);

    const { start: dateCreatedStart } = generateDateRange(dateCreateStart);
    const { end: dateCreatedEnd } = generateDateRange(dateCreateEnd);
    const { start: dateUpdatedStart } = generateDateRange(dateUpdateStart);
    const { end: dateUpdatedEnd } = generateDateRange(dateUpdateEnd);

    const admins = await this.prisma.admin.findMany({
      where: {
        ...(username && {
          username: { contains: username, mode: 'insensitive' },
        }),
        ...(email && { email: { contains: email, mode: 'insensitive' } }),
        ...(dateCreateStart &&
          dateCreateEnd && {
            uploadedAt: {
              gte: dateCreatedStart,
              lt: dateCreatedEnd,
            },
          }),
        ...(dateUpdateStart &&
          dateUpdateEnd && {
            uploadedAt: {
              gte: dateUpdatedStart,
              lt: dateUpdatedEnd,
            },
          }),
      },
      include: {
        blogs: {
          select: {
            title: true,
          },
        },
        documents: {
          select: {
            name: true,
          },
        },
        medias: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { [sort]: order },
      skip,
      take,
    });

    return admins;
  }

  async getAdminByUsername(username: string): Promise<Admin> {
    const admin = await this.prisma.admin.findUnique({
      where: {
        username,
      },
      include: {
        blogs: {
          select: {
            title: true,
          },
        },
        documents: {
          select: {
            name: true,
          },
        },
        medias: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async createAdmin(dto: CreateAdminDto): Promise<Admin> {
    const hashedPassword = await argon.hash(dto.password);

    const admin = await this.prisma.admin.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
      },
    });

    return admin;
  }

  async updateAdminByUsername(
    username: string,
    dto: UpdateAdminDto,
  ): Promise<Admin> {
    const updatedData: UpdateAdminDto = { ...dto };

    if (dto.password) {
      updatedData.password = await argon.hash(dto.password);
    }

    try {
      const admin = await this.prisma.admin.update({
        where: {
          username,
        },
        data: {
          ...updatedData,
        },
      });

      return admin;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Admin not found`);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteAdminByUsername(username: string): Promise<Admin> {
    try {
      const admin = await this.prisma.admin.delete({
        where: {
          username,
        },
      });

      return admin;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Admin not found`);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllAdminIdAndUsername(): Promise<object[]> {
    const adminUsernames = await this.prisma.admin.findMany({
      select: {
        id: true,
        username: true,
      },
    });

    return adminUsernames;
  }
}
