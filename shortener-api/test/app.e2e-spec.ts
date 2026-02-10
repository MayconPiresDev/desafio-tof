import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('API Shortener (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    dataSource = moduleFixture.get<DataSource>(DataSource);

    await app.init();

    await dataSource.query(
      'TRUNCATE TABLE "urls", "users" RESTART IDENTITY CASCADE',
    );
  });

  it('/users (POST) - Registro de Usuário', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Maycon', email: 'maycon@teste.com', password: 'senha123' })
      .expect(201);
  });

  it('/auth/login (POST) - Login e obtenção de Token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'maycon@teste.com', password: 'senha123' })
      .expect(200);

    token = res.body.access_token;
    expect(token).toBeDefined();
  });

  it('/shorten (POST) - Criar URL Autenticada', async () => {
    const res = await request(app.getHttpServer())
      .post('/urls/shorten')
      .set('Authorization', `Bearer ${token}`)
      .send({ originalUrl: 'https://google.com', customAlias: 'google-maycon' })
      .expect(201);

    expect(res.body.shortCode).toBe('google-maycon');
  });

  it('/:code (GET) - Redirecionamento 302', async () => {
    const res = await request(app.getHttpServer())
      .get('/urls/google-maycon')
      .expect(302);

    expect(res.header.location).toBe('https://google.com');
  });

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy();
    }
    if (app) {
      await app.close();
    }
  });
});
