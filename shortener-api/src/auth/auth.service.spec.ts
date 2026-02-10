import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks(); // Limpa chamadas anteriores
  });

  describe('validateUser', () => {
    it('deve retornar o usuário se a senha bater', async () => {
      const user = { id: 1, email: 't@t.com', password: 'hash' };
      mockUsersService.findByEmail.mockResolvedValue(user);

      // Simula que o bcrypt retornou TRUE
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('t@t.com', '123');
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('t@t.com');
    });

    it('deve retornar null se a senha estiver errada', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ password: 'hash' });

      // Simula que o bcrypt retornou FALSE
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('t@t.com', 'errada');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('deve retornar access_token', async () => {
      const result = await service.login({ email: 't@t.com', id: 1 });
      expect(result).toHaveProperty('access_token');
    });
  });
});
