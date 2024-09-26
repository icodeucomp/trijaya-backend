import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumberString,
  IsNumber,
} from 'class-validator';

import { ProductSortBy, OrderBy } from '@common/enums';

export class GetProductDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  businessId?: number;

  @IsOptional()
  @IsString()
  dateStart?: string;

  @IsOptional()
  @IsString()
  dateEnd?: string;

  @IsOptional()
  @IsEnum(ProductSortBy)
  sort?: ProductSortBy = ProductSortBy.Id;

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
