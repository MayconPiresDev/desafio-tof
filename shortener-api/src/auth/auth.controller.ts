import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Login } from './dto/login/login';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza login e retorna o Token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso. Retorna o token.',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas (E-mail ou senha incorretos).',
  })
  @ApiBody({ type: Login })
  login(@Body() loginDto: Login, @Request() req) {
    return this.authService.login(req.user);
  }
}
