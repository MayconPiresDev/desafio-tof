import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { Url } from './entities/url.entity';
import { AuthModule } from '../auth/auth.module';
import { SlugGeneratorService } from './services/slug-generator/slug-generator.service';

@Module({
  imports: [TypeOrmModule.forFeature([Url]), AuthModule],
  controllers: [UrlsController],
  providers: [UrlsService, SlugGeneratorService],
  exports: [UrlsService],
})
export class UrlsModule {}
