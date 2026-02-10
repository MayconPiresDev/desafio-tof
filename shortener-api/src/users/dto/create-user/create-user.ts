import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // <--- Importar

export class CreateUserDto {
  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do usuário',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'joao@email.com',
    description: 'E-mail único para login',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha (mínima de 6 caracteres)',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
