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
import { Admin } from '@prisma/client';

import { ResponsePayload } from '@common/interfaces';
import { JwtGuard } from '@common/guards';
import { successResponsePayload } from '@common/utils';
import {
  CreateAdminDto,
  GetAdminDto,
  UpdateAdminDto,
} from '@modules/admin/dtos';
import { AdminService } from '@modules/admin/admin.service';

@UseGuards(JwtGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  async getAllAdmin(
    @Query() query: GetAdminDto,
  ): Promise<ResponsePayload<Admin[]>> {
    const admins = await this.adminService.getAllAdmin(query);

    return successResponsePayload('Get all admin', admins, admins.length);
  }

  // For showing uploader name list in document
  @Get('idUsername')
  async getAllAdminIdAndUsername(): Promise<ResponsePayload<object[]>> {
    const adminIdAndUsernames =
      await this.adminService.getAllAdminIdAndUsername();

    return successResponsePayload(
      'Get all admin id and username',
      adminIdAndUsernames,
    );
  }

  @Get(':username')
  async getAdminByUsername(
    @Param('username') username: string,
  ): Promise<ResponsePayload<Admin>> {
    const admin = await this.adminService.getAdminByUsername(username);

    return successResponsePayload(`Get admin by username ${username}`, admin);
  }

  @Post()
  async createAdmin(
    @Body() dto: CreateAdminDto,
  ): Promise<ResponsePayload<Admin>> {
    const admin = await this.adminService.createAdmin(dto);

    return successResponsePayload('Create admin', admin);
  }

  @Patch(':username')
  async updateAdminByUsername(
    @Param('username') username: string,
    @Body() dto: UpdateAdminDto,
  ): Promise<ResponsePayload<Admin>> {
    const admin = await this.adminService.updateAdminByUsername(username, dto);

    return successResponsePayload(
      `Update admin by username ${username}`,
      admin,
    );
  }

  @Delete(':username')
  async deleteAdminByUsername(
    @Param('username') username: string,
  ): Promise<ResponsePayload<Admin>> {
    const admin = await this.adminService.deleteAdminByUsername(username);

    return successResponsePayload(
      `Delete admin by username ${username}`,
      admin,
    );
  }
}
