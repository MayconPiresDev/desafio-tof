import { Test, TestingModule } from '@nestjs/testing';
import { SlugGeneratorService } from './slug-generator.service';

describe('SlugGeneratorService', () => {
  let service: SlugGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlugGeneratorService],
    }).compile();

    service = module.get<SlugGeneratorService>(SlugGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
