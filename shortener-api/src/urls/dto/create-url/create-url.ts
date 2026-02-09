import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUrlDto {
  @IsNotEmpty({ message: 'A URL original é obrigatória.' })
  @IsUrl({}, { message: 'A URL fornecida não é válida.' })
  originalUrl: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'O alias deve ter no mínimo 3 caracteres.' })
  @MaxLength(30, { message: 'O alias deve ter no máximo 30 caracteres.' })
  @Matches(/^[a-z0-9_-]+$/, {
    message:
      'O alias deve conter apenas letras minúsculas, números, hífens e sublinhados.',
  })
  customAlias?: string;
}
