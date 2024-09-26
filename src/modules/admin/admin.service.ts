import { Injectable } from '@nestjs/common';
import { Admin } from '@prisma/client';
import * as argon from 'argon2';

import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateAdminDto, UpdateAdminDto } from '@modules/admin/dtos';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllAdmin(): Promise<Admin[]> {
    const admins = await this.prisma.admin.findMany();

    return admins;
  }

  async getAdminById(adminId: number): Promise<Admin> {
    const admin = await this.prisma.admin.findUnique({
      where: {
        id: adminId,
      },
    });

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

  async updateAdminById(adminId: number, dto: UpdateAdminDto): Promise<Admin> {
    const updatedData: UpdateAdminDto = { ...dto };

    if (dto.password) {
      updatedData.password = await argon.hash(dto.password);
    }

    const admin = await this.prisma.admin.update({
      where: {
        id: adminId,
      },
      data: {
        ...updatedData,
      },
    });

    return admin;
  }

  async deleteAdminById(adminId: number): Promise<Admin> {
    const admin = await this.prisma.admin.delete({
      where: {
        id: adminId,
      },
    });

    return admin;
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
