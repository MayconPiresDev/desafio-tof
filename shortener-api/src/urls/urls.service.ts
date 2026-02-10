import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';
import { CreateUrlDto } from './dto/create-url/create-url';
import { UpdateUrlDto } from './dto/update-url/update-url';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
    private configService: ConfigService,
  ) {}

  async create(createUrlDto: CreateUrlDto, user: User | null) {
    const { originalUrl, customAlias } = createUrlDto;

    if (customAlias) {
      const exists = await this.urlRepository.findOne({
        where: { shortCode: customAlias },
      });
      if (exists) throw new ConflictException('Alias já está em uso.');

      return this.saveUrl(originalUrl, customAlias, user);
    }

    // Lógica de colisão para slug automático
    let shortCode: string;
    let isUnique = false;
    while (!isUnique) {
      shortCode = this.generateShortCode();
      const exists = await this.urlRepository.findOne({ where: { shortCode } });
      if (!exists) isUnique = true;
    }

    return this.saveUrl(originalUrl, shortCode!, user);
  }

  private generateShortCode(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async saveUrl(
    originalUrl: string,
    shortCode: string,
    user: User | null,
  ) {
    const baseUrl: string =
      this.configService.get('BASE_URL') || 'http://localhost:3000';
    const newUrl = this.urlRepository.create({
      originalUrl,
      shortCode,
      userId: user?.id,
    });

    const saved = await this.urlRepository.save(newUrl);
    return {
      ...saved,
      shortLink: `${baseUrl}/${shortCode}`,
    };
  }

  async findByCode(code: string): Promise<Url> {
    const url = await this.urlRepository.findOne({
      where: { shortCode: code },
    });

    if (!url) {
      throw new NotFoundException('URL não encontrada.');
    }

    url.clicks++;
    await this.urlRepository.save(url);

    return url;
  }

  async findAllByUserId(userId: number): Promise<Url[]> {
    return this.urlRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateUrlDto: UpdateUrlDto, userId: number) {
    const url = await this.urlRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!url) {
      throw new NotFoundException('URL não encontrada ou sem permissão.');
    }

    this.urlRepository.merge(url, updateUrlDto);
    return this.urlRepository.save(url);
  }

  async remove(id: number, userId: number) {
    const url = await this.urlRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!url) {
      throw new NotFoundException('URL não encontrada ou sem permissão.');
    }

    return this.urlRepository.softDelete(id);
  }
}
