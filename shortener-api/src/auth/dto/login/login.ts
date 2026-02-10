import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class Login {
  @ApiProperty({
    example: 'teste@teddy.com.br',
    description: 'O e-mail do usuário cadastrado',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'senha_super_secreta',
    description: 'A senha do usuário',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
