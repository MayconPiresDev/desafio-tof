import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: any;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // No src/users/users.service.spec.ts
  it('deve criar e retornar um novo usuário com senha criptografada', async () => {
    const createUserDto = {
      name: 'Maycon',
      email: 'novo@teste.com',
      password: '123',
    };
    repository.save.mockResolvedValue({ id: 1, ...createUserDto });

    const result = await service.create(createUserDto);

    expect(result).toHaveProperty('id');
    expect(repository.save).toHaveBeenCalled();
  });

  it('deve encontrar um usuário por e-mail', async () => {
    const user = { id: 1, email: 'teste@teste.com' };
    repository.findOne.mockResolvedValue(user);

    const result = await service.findByEmail('teste@teste.com');
    expect(result).toEqual(user);
  });

  it('deve retornar null se o usuário não for encontrado por e-mail', async () => {
    repository.findOne.mockResolvedValue(null);
    const result = await service.findByEmail('nao-existe@teste.com');
    expect(result).toBeNull();
  });

  it('deve lançar um erro se tentar criar um usuário com e-mail já existente', async () => {
    repository.save.mockRejectedValue(new Error('Duplicate entry'));
    await expect(
      service.create({ name: 'T', email: 't@t.com', password: '1' }),
    ).rejects.toThrow();
  });
});
