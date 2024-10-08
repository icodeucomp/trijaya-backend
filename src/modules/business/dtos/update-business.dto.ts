import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

import {
  CreateBusinessDto,
  BusinessImageHeaderDto,
  ProductImageHeaderDto,
} from '@modules/business/dtos';

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {
  @IsString()
  @IsOptional()
  slug?: string;

  @ValidateNested()
  @Type(() => BusinessImageHeaderDto)
  @IsOptional()
  imageHeader?: BusinessImageHeaderDto;

  @ValidateNested()
  @Type(() => ProductImageHeaderDto)
  @IsOptional()
  productHeader?: ProductImageHeaderDto;
}
