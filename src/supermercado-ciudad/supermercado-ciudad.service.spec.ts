import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';

describe('SupermercadoCiudadService', () => {
  let service: SupermercadoCiudadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoCiudadService],
    }).compile();

    service = module.get<SupermercadoCiudadService>(SupermercadoCiudadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
