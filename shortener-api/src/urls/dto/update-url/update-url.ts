import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsNotEmpty } from 'class-validator';

export class UpdateUrlDto {
  @ApiProperty({
    example: 'https://www.novo-site.com',
    description: 'A nova URL original para este link',
  })
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;
}
