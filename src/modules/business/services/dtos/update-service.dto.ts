import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

import { CreateServiceDto } from '@modules/business/services/dtos';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @IsString()
  @IsOptional()
  slug?: string;
}
