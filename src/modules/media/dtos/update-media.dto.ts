import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { CreateMediaDto } from '@modules/media/dtos';

export class UpdateMediaDto extends PartialType(CreateMediaDto) {
  @IsString()
  @IsOptional()
  slug?: string;

  @IsNumber()
  @IsOptional()
  uploaderId?: number;
}
