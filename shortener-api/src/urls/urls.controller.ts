import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  Request,
  UseGuards,
  Req,
  Redirect,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url/create-url';
import { UpdateUrlDto } from './dto/update-url/update-url';
import { JwtOptionalAuthGuard } from '../auth/guards/jwt-auth/jwt-optional-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUrlDto: UpdateUrlDto,
    @Req() req: any,
  ) {
    return this.urlsService.update(+id, updateUrlDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number, @Req() req: any) {
    return this.urlsService.remove(+id, req.user.id);
  }

  @Post('shorten')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtOptionalAuthGuard)
  async shorten(@Body() createUrlDto: CreateUrlDto, @Req() req: any) {
    return this.urlsService.shorten(createUrlDto, req.user);
  }

  @Get('my-urls')
  @UseGuards(JwtAuthGuard)
  async listMyUrls(@Req() req: any) {
    return this.urlsService.findAllByUserId(req.user.id);
  }

  @Get(':code')
  @Redirect()
  async redirect(@Param('code') code: string) {
    const originalUrl = await this.urlsService.redirect(code);
    return { url: originalUrl, statusCode: 302 };
  }
}
