import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('UrlsService (Unidade)', () => {
  let service: UrlsService;
  let repository: any;

  const mockUrl = {
    id: 1,
    originalUrl: 'https://teddy.com.br',
    shortCode: 'abc123',
    clicks: 0,
    user: { id: 1 },
  };

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((url) =>
        Promise.resolve({ id: 1, ...url, createdAt: new Date() }),
      ),
    findOne: jest.fn(),
    softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
    merge: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        { provide: getRepositoryToken(Url), useValue: mockRepository },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('http://localhost:3000') },
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
    repository = module.get(getRepositoryToken(Url));
  });

  describe('create', () => {
    it('deve gerar um shortCode único de 6 caracteres', async () => {
      repository.findOne.mockResolvedValue(null); // Simula que não há colisão
      const result = await service.create(
        { originalUrl: 'https://site.com' },
        null,
      );

      expect(result.shortCode).toHaveLength(6);
      expect(result.shortCode).toMatch(/^[A-Za-z0-9]{6}$/); // Valida a Regex do PDF
    });

    it('deve lançar ConflictException se o alias customizado já estiver em uso', async () => {
      repository.findOne.mockResolvedValue(mockUrl); // Simula que o alias já existe
      await expect(
        service.create(
          { originalUrl: 'https://site.com', customAlias: 'meu-link' },
          { id: 1 },
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findByCode', () => {
    it('deve incrementar o contador de cliques e salvar', async () => {
      repository.findOne.mockResolvedValue({ ...mockUrl });
      const result = await service.findByCode('abc123');

      expect(result.clicks).toBe(1);
      expect(repository.save).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException para códigos inexistentes', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findByCode('errado')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar a URL se o usuário for o dono', async () => {
      repository.findOne.mockResolvedValue({ id: 1, user: { id: 10 } });
      const dto = { originalUrl: 'https://novo.com' };

      await service.update(1, dto, 10);

      expect(repository.merge).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('deve lançar NotFound se a URL não pertencer ao usuário', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.update(1, {}, 99)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve executar softDelete se o usuário for o dono', async () => {
      repository.findOne.mockResolvedValue({ id: 1, user: { id: 10 } });
      await service.remove(1, 10);
      expect(repository.softDelete).toHaveBeenCalledWith(1);
    });
  });
});
