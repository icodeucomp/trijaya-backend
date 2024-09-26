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

import { Public } from '@common/decorators';
import { JwtGuard } from '@common/guards';
import { successResponsePayload } from '@common/utils';
import {
  CreateServiceDto,
  GetServiceDto,
  UpdateServiceDto,
} from '@modules/business/services/dtos';
import { ServicesService } from '@modules/business/services/services.service';

@UseGuards(JwtGuard)
@Controller('services')
export class ServicesController {
  constructor(private serviceService: ServicesService) {}

  @Public()
  @Get()
  async getAllService(@Query() query: GetServiceDto) {
    const services = await this.serviceService.getAllService(query);

    return successResponsePayload('Get all service', services);
  }

  @Public()
  @Get(':serviceSlug')
  async getServiceBySlug(@Param('serviceSlug') serviceSlug: string) {
    const service = await this.serviceService.getServiceBySlug(serviceSlug);

    return successResponsePayload(
      `Get service by slug ${serviceSlug}`,
      service,
    );
  }

  @Post()
  async createService(@Body() dto: CreateServiceDto) {
    const service = await this.serviceService.createService(dto);

    return successResponsePayload('Create service', service);
  }

  @Patch(':serviceSlug')
  async updateServiceBySlug(
    @Param('serviceSlug') serviceSlug: string,
    @Body() dto: UpdateServiceDto,
  ) {
    const service = await this.serviceService.updateServiceBySlug(
      serviceSlug,
      dto,
    );

    return successResponsePayload(
      `Update service by slug ${serviceSlug}`,
      service,
    );
  }

  @Delete(':serviceSlug')
  async deleteServiceBySlug(@Param('serviceSlug') serviceSlug: string) {
    const service = await this.serviceService.deleteServiceBySlug(serviceSlug);

    return successResponsePayload(
      `Delete service by slug ${serviceSlug}`,
      service,
    );
  }
}
