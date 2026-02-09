import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Url } from './entities/url.entity';
import { CreateUrlDto } from './dto/create-url/create-url';
import { UpdateUrlDto } from './dto/update-url/update-url';
import { SlugGeneratorService } from './services/slug-generator/slug-generator.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    private readonly slugGenerator: SlugGeneratorService,
    private readonly configService: ConfigService,
  ) {}

  async update(id: number, updateUrlDto: UpdateUrlDto, userId: number) {
    const url = await this.urlRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!url) {
      throw new NotFoundException(
        'URL não encontrada ou você não tem permissão para editá-la.',
      );
    }

    this.urlRepository.merge(url, updateUrlDto);
    return this.urlRepository.save(url);
  }

  async remove(id: number, userId: number) {
    const url = await this.urlRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!url) {
      throw new NotFoundException(
        'URL não encontrada ou você não tem permissão para excluí-la.',
      );
    }

    return this.urlRepository.softDelete(id);
  }

  async shorten(createUrlDto: CreateUrlDto, user?: User): Promise<any> {
    const { originalUrl, customAlias } = createUrlDto;
    let shortCode = customAlias;

    // 1. Validação de Alias
    if (shortCode) {
      const exists = await this.urlRepository.findOne({
        where: { shortCode },
        withDeleted: true,
      });
      if (exists) {
        throw new ConflictException('Este alias já está em uso.');
      }
    } else {
      shortCode = await this.generateUniqueCode();
    }

    // 2. Criação
    const newUrl = this.urlRepository.create({
      originalUrl,
      shortCode,
      user,
    });

    try {
      await this.urlRepository.save(newUrl);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao salvar a URL.');
    }

    // 3. Retorno
    const baseUrl =
      this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');

    return {
      originalUrl: newUrl.originalUrl,
      shortUrl: `${cleanBaseUrl}/${newUrl.shortCode}`,
      code: newUrl.shortCode,
    };
  }

  async findAllByUserId(userId: number): Promise<Url[]> {
    return this.urlRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async redirect(code: string): Promise<string> {
    const url = await this.urlRepository.findOne({
      where: { shortCode: code },
    });

    if (!url) {
      throw new NotFoundException('URL não encontrada.');
    }

    url.clicks++;
    await this.urlRepository.save(url);

    return url.originalUrl;
  }

  private async generateUniqueCode(): Promise<string> {
    let code = '';
    let exists = true;
    while (exists) {
      code = this.slugGenerator.generate(6);
      const url = await this.urlRepository.findOne({
        where: { shortCode: code },
      });
      exists = !!url;
    }
    return code;
  }
}
