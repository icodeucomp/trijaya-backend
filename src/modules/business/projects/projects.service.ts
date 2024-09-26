import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from '@prisma/client';

import { PrismaService } from '@shared/prisma/prisma.service';
import {
  generateDateRange,
  generatePagination,
  generateSlug,
} from '@common/utils';
import {
  CreateProjectDto,
  GetProjectDto,
  UpdateProjectDto,
} from '@modules/business/projects/dtos';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getAllProject(query: GetProjectDto): Promise<Project[]> {
    const { title, dateStart, dateEnd, sort, order, page, limit } = query;
    const { skip, take } = generatePagination(page, limit);

    const { start: dateStarted } = generateDateRange(dateStart);
    const { end: dateEnded } = generateDateRange(dateEnd);

    const projects = this.prisma.project.findMany({
      where: {
        ...(title && { title: { contains: title, mode: 'insensitive' } }),
        ...(dateStart &&
          dateEnd && {
            updatededAt: {
              gte: dateStarted,
              lt: dateEnded,
            },
          }),
      },
      include: {
        business: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { [sort]: order },
      skip,
      take,
    });

    return projects;
  }

  async getProjectBySlug(projectSlug: string): Promise<Project> {
    const project = await this.prisma.project.findFirst({
      where: {
        slug: projectSlug,
      },
      include: {
        business: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async createProject(dto: CreateProjectDto): Promise<Project> {
    const slug = generateSlug(dto.title);

    const project = await this.prisma.project.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        mediaUrls: dto.mediaUrls,
        businessId: dto.businessId,
      },
    });

    return project;
  }

  async updateProjectBySlug(projectslug: string, dto: UpdateProjectDto) {
    const existingProject = await this.getProjectBySlug(projectslug);

    const updatedData: UpdateProjectDto = { ...dto };

    if (dto.title) {
      updatedData.slug = generateSlug(updatedData.title);
    }

    const project = await this.prisma.project.update({
      where: {
        id: existingProject.id,
      },
      data: updatedData,
    });

    return project;
  }

  async deleteProjectBySlug(projectslug: string): Promise<Project> {
    const existingProject = await this.getProjectBySlug(projectslug);

    const project = await this.prisma.project.delete({
      where: {
        id: existingProject.id,
      },
    });

    return project;
  }
}
