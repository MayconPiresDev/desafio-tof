import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class Register {
  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do usuário',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'teste@teddy.com.br',
    description: 'E-mail para login',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha (mínimo 6 caracteres)',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
