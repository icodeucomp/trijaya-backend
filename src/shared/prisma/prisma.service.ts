import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Prisma client connected successfully.');
    } catch (error) {
      console.error('Failed to connect to Prisma:', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      console.log('Prisma client disconnected successfully.');
    } catch (error) {
      console.error('Failed to disconnect from Prisma:', error);
    }
  }
}
