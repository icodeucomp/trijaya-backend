import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class BusinessImageHeaderDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}

export class ProductImageHeaderDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @ValidateNested()
  @Type(() => BusinessImageHeaderDto)
  @IsOptional()
  imageHeader?: BusinessImageHeaderDto;

  @ValidateNested()
  @Type(() => ProductImageHeaderDto)
  @IsOptional()
  productHeader?: ProductImageHeaderDto;
}
