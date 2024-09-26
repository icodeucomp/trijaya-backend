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

import { CreateBlogDto, GetBlogDto, UpdateBlogDto } from '@modules/blogs/dtos';
import { BlogsService } from '@modules/blogs/blogs.service';
import { GetUser, Public } from '@common/decorators';
import { JwtGuard } from '@common/guards';
import { successResponsePayload } from '@common/utils';

@UseGuards(JwtGuard)
@Controller('blogs')
export class BlogsController {
  constructor(private blogservice: BlogsService) {}

  @Public()
  @Get()
  async getAllBlog(@Query() query: GetBlogDto) {
    const blogs = await this.blogservice.getAllBlog(query);

    return successResponsePayload('Get all blog', blogs);
  }

  @Public()
  @Get(':blogSlug')
  async getBlogBySlug(@Param('blogSlug') blogSlug: string) {
    const blog = await this.blogservice.getBlogBySlug(blogSlug);

    return successResponsePayload(`Get blog by slug ${blogSlug}`, blog);
  }

  @Post()
  async createBlog(
    @GetUser('id') authorId: number,
    @Body() dto: CreateBlogDto,
  ) {
    const blog = await this.blogservice.createBlog(authorId, dto);

    return successResponsePayload('Create blog', blog);
  }

  @Patch(':blogSlug')
  async updateBlogBySlug(
    @Param('blogSlug') blogSlug: string,
    @Body() dto: UpdateBlogDto,
  ) {
    const blog = await this.blogservice.updateBlogBySlug(blogSlug, dto);

    return successResponsePayload(`Update blog by slug ${blogSlug}`, blog);
  }

  @Delete(':blogSlug')
  async deleteBlogBySlug(@Param('blogSlug') blogSlug: string) {
    const blog = await this.blogservice.deleteBlogBySlug(blogSlug);

    return successResponsePayload(`Delete blog by slug ${blogSlug}`, blog);
  }
}
