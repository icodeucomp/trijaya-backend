import { IsOptional, IsEnum, IsString, IsNumberString } from 'class-validator';

import { AdminSortBy, OrderBy } from '@common/enums';

export class GetContactUsDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsNumberString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  dateCreateStart?: string;

  @IsOptional()
  @IsString()
  dateCreateEnd?: string;

  @IsOptional()
  @IsString()
  dateUpdateStart?: string;

  @IsOptional()
  @IsString()
  dateUpdateEnd?: string;

  @IsOptional()
  @IsEnum(AdminSortBy)
  sort?: AdminSortBy = AdminSortBy.Id;

  @IsOptional()
  @IsEnum(OrderBy)
  order?: OrderBy = OrderBy.Asc;

  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @IsOptional()
  @IsNumberString()
  limit?: string = '10';
}
