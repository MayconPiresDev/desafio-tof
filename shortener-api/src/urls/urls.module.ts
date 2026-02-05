import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { SlugGeneratorService } from './services/slug-generator/slug-generator.service';
import { UrlsService } from './urls.service';

@Module({
  providers: [UrlsService, SlugGeneratorService],
  controllers: [UrlsController]
})
export class UrlsModule {}
