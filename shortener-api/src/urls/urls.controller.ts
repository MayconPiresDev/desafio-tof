import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url/create-url';
import { UpdateUrlDto } from './dto/update-url/update-url';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { JwtOptionalAuthGuard } from '../auth/guards/jwt-auth/jwt-optional-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: { id: number; email: string };
}

@ApiTags('URLs')
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @UseGuards(JwtOptionalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encurtar URL (Aceita anônimo ou logado)' })
  @ApiResponse({ status: 201, description: 'URL criada.' })
  @Post('shorten') // Ajuste se sua rota for diferente
  async create(
    @Body() createUrlDto: CreateUrlDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user ? (req.user as any) : null;
    return this.urlsService.create(createUrlDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar histórico de URLs do usuário' })
  @Get('my-urls')
  listMyUrls(@Req() req: AuthenticatedRequest) {
    return this.urlsService.findAllByUserId(req.user.id);
  }

  @ApiOperation({ summary: 'Redireciona para o link original' })
  @ApiParam({
    name: 'code',
    example: 'netflix',
    description: 'O código curto da URL',
  })
  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: any) {
    const url = await this.urlsService.findByCode(code);
    return res.redirect(url.originalUrl);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Editar URL original (Apenas dono)' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.urlsService.update(+id, updateUrlDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir URL (Soft Delete - Apenas dono)' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.urlsService.remove(+id, req.user.id);
  }
}
