import { IsOptional, IsEnum, IsString, IsNumberString } from 'class-validator';

import { BlogSortBy, OrderBy } from '@common/enums';
import { defaultLimitPageData, defaultPage } from '@common/utils';

export class GetBlogDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  dateStart?: string;

  @IsOptional()
  @IsString()
  dateEnd?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsEnum(BlogSortBy)
  sort?: BlogSortBy = BlogSortBy.Id;

  @IsOptional()
  @IsEnum(OrderBy)
  order?: OrderBy = OrderBy.Asc;

  @IsOptional()
  @IsNumberString()
  page?: string = defaultPage;

  @IsOptional()
  @IsNumberString()
  limit?: string = defaultLimitPageData;
}
