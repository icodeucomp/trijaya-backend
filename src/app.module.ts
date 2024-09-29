import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUploadModule } from '@shared/files/upload/file-upload.module';
import { PrismaModule } from '@shared/prisma/prisma.module';
import { S3Module } from '@shared/s3/s3.module';
import { AdminModule } from '@modules/admin/admin.module';
import { AuthenticationModule } from '@modules/authentication/authentication.module';
import { BlogsModule } from '@modules/blogs/blogs.module';
import { DocumentsModule } from '@modules/documents/documents.module';
import { BusinessModule } from '@modules/business/business.module';
import { MediaModule } from '@modules/media/media.module';
import { FileDownloadModule } from './shared/files/download/file-download.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    FileUploadModule,
    FileDownloadModule,
    PrismaModule,
    S3Module,
    AdminModule,
    AuthenticationModule,
    BlogsModule,
    BusinessModule,
    DocumentsModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
