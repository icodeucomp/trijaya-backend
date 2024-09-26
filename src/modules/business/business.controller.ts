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
  CreateBusinessDto,
  GetBusinessDto,
  UpdateBusinessDto,
} from '@modules/business/dtos';
import { BusinessService } from '@modules/business/business.service';

@UseGuards(JwtGuard)
@Controller('business')
export class BusinessController {
  constructor(private businessService: BusinessService) {}

  @Public()
  @Get()
  async getAllBusiness(@Query() query: GetBusinessDto) {
    const business = await this.businessService.getAllBusiness(query);

    return successResponsePayload('Get all business', business);
  }

  @Public()
  @Get(':businessSlug')
  async getBusinessBySlug(@Param('businessSlug') businessSlug: string) {
    const business = await this.businessService.getBusinessBySlug(businessSlug);

    return successResponsePayload(
      `Get business by slug ${businessSlug}`,
      business,
    );
  }

  @Post()
  async createBusiness(@Body() dto: CreateBusinessDto) {
    const business = await this.businessService.createBusiness(dto);

    return successResponsePayload('Create business', business);
  }

  @Patch(':businessSlug')
  async updateBusinessBySlug(
    @Param('businessSlug') businessSlug: string,
    @Body() dto: UpdateBusinessDto,
  ) {
    const business = await this.businessService.updateBusinessBySlug(
      businessSlug,
      dto,
    );

    return successResponsePayload(
      `Update business by slug ${businessSlug}`,
      business,
    );
  }

  @Delete(':businessSlug')
  async deleteBusinessBySlug(@Param('businessSlug') businessSlug: string) {
    const business =
      await this.businessService.deleteBusinessBySlug(businessSlug);

    return successResponsePayload(
      `Delete business by slug ${businessSlug}`,
      business,
    );
  }
}
