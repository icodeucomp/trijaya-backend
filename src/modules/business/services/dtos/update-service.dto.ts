import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

import {
  CreateServiceDto,
  ServiceMediaDto,
} from '@modules/business/services/dtos';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @IsString()
  @IsOptional()
  slug?: string;

  @ValidateNested()
  @Type(() => ServiceMediaDto)
  @IsOptional()
  media?: ServiceMediaDto[];
}
