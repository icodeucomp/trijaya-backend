import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Admin } from '@prisma/client';

import { CreateAdminDto, UpdateAdminDto } from './dto';
import { AdminService } from './admin.service';
import { ResponsePayload } from '../../common/interfaces';
import { JwtGuard } from '../../common/guards';
import { successResponsePayload } from '../../common/utils';

@UseGuards(JwtGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  async getAllAdmin(): Promise<ResponsePayload<Admin[]>> {
    const admins = await this.adminService.getAllAdmin();

    return successResponsePayload('Get all admin', admins);
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

  @Get(':id')
  async getAdminById(
    @Param('id', ParseIntPipe) adminId: number,
  ): Promise<ResponsePayload<Admin>> {
    const admin = await this.adminService.getAdminById(adminId);

    return successResponsePayload(`Get admin by id ${adminId}`, admin);
  }

  @Post()
  async createAdmin(
    @Body() dto: CreateAdminDto,
  ): Promise<ResponsePayload<Admin>> {
    const admin = await this.adminService.createAdmin(dto);

    return successResponsePayload('Create admin', admin);
  }

  @Patch(':id')
  async updateAdminById(
    @Param('id', ParseIntPipe) adminId: number,
    @Body() dto: UpdateAdminDto,
  ): Promise<ResponsePayload<Admin>> {
    const admin = await this.adminService.updateAdminById(adminId, dto);

    return successResponsePayload(`Update admin by id ${adminId}`, admin);
  }

  @Delete(':id')
  async deleteAdminById(
    @Param('id', ParseIntPipe) adminId: number,
  ): Promise<ResponsePayload<Admin>> {
    const admin = await this.adminService.deleteAdminById(adminId);

    return successResponsePayload(`Delete admin by id ${adminId}`, admin);
  }
}
