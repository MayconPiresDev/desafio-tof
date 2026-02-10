import { IsNotEmpty, IsUrl, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({ example: 'https://teddy360.com.br/material/marco-legal' })
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;

  @ApiPropertyOptional({
    example: 'meu-link-personalizado',
    description:
      '3-30 caracteres, letras minúsculas, números, hífens ou underscores.',
  })
  @IsOptional()
  @Matches(/^[a-z0-9_-]{3,30}$/, {
    message:
      'Alias deve ter entre 3 e 30 caracteres e conter apenas a-z, 0-9, - ou _',
  })
  customAlias?: string;
}
