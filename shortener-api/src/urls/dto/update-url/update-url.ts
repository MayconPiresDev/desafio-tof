import { PartialType } from '@nestjs/mapped-types';
import { CreateUrlDto } from '../create-url/create-url';

export class UpdateUrlDto extends PartialType(CreateUrlDto) {}
