import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user/create-user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Cria a instância (o @BeforeInsert na entidade vai criptografar a senha ao salvar)
      const user = this.usersRepository.create(createUserDto);

      // Salva no banco
      return await this.usersRepository.save(user);
    } catch (error) {
      // Código 23505 é o erro de violação de chave única no Postgres (email duplicado)
      if (error.code === '23505') {
        throw new ConflictException('Este e-mail já está cadastrado.');
      }
      throw new InternalServerErrorException('Erro ao criar usuário.');
    }
  }

  // Método auxiliar para buscar por email (será usado na Autenticação depois)
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'createdAt'], // Traz a senha para validar o login
    });
  }
}
