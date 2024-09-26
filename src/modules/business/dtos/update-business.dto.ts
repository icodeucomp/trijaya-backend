import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

import { CreateBusinessDto } from '@modules/business/dtos';

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {
  @IsString()
  @IsOptional()
  slug?: string;
}
