import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';

describe('SupermercadoService', () => {
  let supermercadoService: SupermercadoService;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let supermercadosList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    supermercadoService = module.get<SupermercadoService>(SupermercadoService);
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermercadoRepository.clear();

    supermercadosList = [];
    for(let i = 0; i < 5; i++){
      const supermercado: SupermercadoEntity = await supermercadoRepository.save({
        nombre: faker.lorem.sentence(3),
        longitud: 1,
        latitud: 1,
        pag_web: faker.internet.domainName()
      })
      supermercadosList.push(supermercado);
    }
  }

  it('should be defined', () => {
    expect(supermercadoService).toBeDefined();
  });

  it('findAll should return all supermercados', async () => {
    const supermercados: SupermercadoEntity[] = await supermercadoService.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(supermercadosList.length);
  });

  it('findOne should return a supermercado by id', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadosList[0];
    const supermercado: SupermercadoEntity = await supermercadoService.findOne(storedSupermercado.id);
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre)
  });

  it('findOne should throw an exception for an invalid supermercado', async () => {
    await expect(() => supermercadoService.findOne("0")).rejects.toHaveProperty("message", "The supermercado with the given id was not found")
  });

  it('create should return a new supermercado', async () => {
    const supermercado: SupermercadoEntity = {
      id: "",
      nombre: faker.lorem.sentence(3),
      longitud: 1,
      latitud: 1,
      pag_web: faker.internet.domainName(),
      ciudades: []
    }

    const newSupermercado: SupermercadoEntity = await supermercadoService.create(supermercado);
    expect(newSupermercado).not.toBeNull();

    const storedSupermercado: SupermercadoEntity = await supermercadoRepository.findOne({where: {id: newSupermercado.id}})
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(newSupermercado.nombre)
  });

  it('create with invalid name should throw an exception', async () => {
    const supermercado: SupermercadoEntity = {
      id: "",
      nombre: "nombre",
      longitud: 1,
      latitud: 1,
      pag_web: faker.internet.domainName(),
      ciudades: []
    }

    await expect(() => supermercadoService.create(supermercado)).rejects.toHaveProperty("message", "The length of the supermercado name is not valid")
  });

  it('update should modify a supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado.nombre = faker.lorem.sentence(3);
  
    const updatedCiudad: SupermercadoEntity = await supermercadoService.update(supermercado.id, supermercado);
    expect(updatedCiudad).not.toBeNull();
  
    const storedSupermercado: SupermercadoEntity = await supermercadoRepository.findOne({ where: { id: supermercado.id } })
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre)
  });

  it('update should throw an exception for an invalid supermercado', async () => {
    let supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado = {
      ...supermercado, nombre: faker.lorem.sentence(3),
    }
    await expect(() => supermercadoService.update("0", supermercado)).rejects.toHaveProperty("message", "The supermercado with the given id was not found")
  });

  it('update with invalid name should throw an exception', async () => {
    let supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado = {
      ...supermercado, nombre: "nombre",
    }

    await expect(() => supermercadoService.update("0", supermercado)).rejects.toHaveProperty("message", "The length of the supermercado name is not valid")
  });

  it('delete should remove a supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await supermercadoService.delete(supermercado.id);
  
    const deletedSupermercado: SupermercadoEntity = await supermercadoRepository.findOne({ where: { id: supermercado.id } })
    expect(deletedSupermercado).toBeNull();
  });

  it('delete should throw an exception for an invalid supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await supermercadoService.delete(supermercado.id);
    await expect(() => supermercadoService.delete("0")).rejects.toHaveProperty("message", "The supermercado with the given id was not found")
  });
});