import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './modules/admin/admin.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { FileUploadModule } from './shared/file-upload/file-upload.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { S3Module } from './shared/s3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AdminModule,
    AuthenticationModule,
    BlogsModule,
    DocumentsModule,
    FileUploadModule,
    PrismaModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
