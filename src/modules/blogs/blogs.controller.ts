import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateBlogDto, GetBlogDto, UpdateBlogDto } from './dto';
import { BlogsService } from './blogs.service';
import { GetUser, Public } from '../../common/decorators';
import { JwtGuard } from '../../common/guards';
import { successResponsePayload } from '../../common/utils';

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
  @Get(':id')
  async getBlogById(@Param('id', ParseIntPipe) blogId: number) {
    const blog = await this.blogservice.getBlogById(blogId);

    return successResponsePayload(`Get blog by id ${blogId}`, blog);
  }

  @Post()
  async createBlog(
    @GetUser('id') authorId: number,
    @Body() dto: CreateBlogDto,
  ) {
    const blog = await this.blogservice.createBlog(authorId, dto);

    return successResponsePayload('Create blog', blog);
  }

  @Patch(':id')
  async updateBlogById(
    @Param('id', ParseIntPipe) blogId: number,
    @Body() dto: UpdateBlogDto,
  ) {
    const blog = await this.blogservice.updateBlogById(blogId, dto);

    return successResponsePayload(`Update blog by id ${blogId}`, blog);
  }

  @Delete(':id')
  async deleteBlogById(@Param('id', ParseIntPipe) blogId: number) {
    const blog = await this.blogservice.deleteBlogById(blogId);

    return successResponsePayload(`Delete blog by id ${blogId}`, blog);
  }
}
