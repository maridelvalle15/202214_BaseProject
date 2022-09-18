import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CiudadService', () => {
  let ciudadService: CiudadService;
  let ciudadRepository: Repository<CiudadEntity>;
  let ciudadesList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    ciudadService = module.get<CiudadService>(CiudadService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    ciudadRepository.clear();

    ciudadesList = [];
    for(let i = 0; i < 5; i++){
      const ciudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.address.cityName(), 
      pais: "Argentina",
      num_habitantes: Math.random()
    })
    ciudadesList.push(ciudad);
  }
}

  it('should be defined', () => {
    expect(ciudadService).toBeDefined();
  });

  it('findAll should return all ciudades', async () => {
    const ciudades: CiudadEntity[] = await ciudadService.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadesList.length);
  });

  it('findOne should return a ciudad by id', async () => {
    const storedCiudad: CiudadEntity = ciudadesList[0];
    const ciudad: CiudadEntity = await ciudadService.findOne(storedCiudad.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre)
  });

  it('findOne should throw an exception for an invalid ciudad', async () => {
    await expect(() => ciudadService.findOne("0")).rejects.toHaveProperty("message", "The ciudad with the given id was not found")
  });

  it('create should return a new ciudad', async () => {
    const ciudad: CiudadEntity = {
      id: "",
      nombre: faker.address.cityName(), 
      pais: "Argentina",
      num_habitantes: Math.random(),
      supermercados: []
    }

    const newCiudad: CiudadEntity = await ciudadService.create(ciudad);
    expect(newCiudad).not.toBeNull();

    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({where: {id: newCiudad.id}})
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(newCiudad.nombre)
  });

  it('create with invalid pais should throw an exception', async () => {
    const ciudad: CiudadEntity = {
      id: "",
      nombre: faker.address.cityName(), 
      pais: "Holanda",
      num_habitantes: Math.random(),
      supermercados: []
    }

    await expect(() => ciudadService.create(ciudad)).rejects.toHaveProperty("message", "The given pais for ciudad is not valid")
  });

  it('update should modify a ciudad', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    ciudad.nombre = "New name";
  
    const updatedCiudad: CiudadEntity = await ciudadService.update(ciudad.id, ciudad);
    expect(updatedCiudad).not.toBeNull();
  
    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({ where: { id: ciudad.id } })
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(ciudad.nombre)
  });

  it('update should throw an exception for an invalid ciudad', async () => {
    let ciudad: CiudadEntity = ciudadesList[0];
    ciudad = {
      ...ciudad, nombre: "New name"
    }
    await expect(() => ciudadService.update("0", ciudad)).rejects.toHaveProperty("message", "The ciudad with the given id was not found")
  });

  it('update with invalid pais should throw an exception', async () => {
    let ciudad: CiudadEntity = ciudadesList[0];
    ciudad = {
      ...ciudad, pais: "Chile"
    }
    await expect(() => ciudadService.update("0", ciudad)).rejects.toHaveProperty("message", "The given pais for ciudad is not valid")
  });

  it('delete should remove a ciudad', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await ciudadService.delete(ciudad.id);
  
    const deletedCategoria: CiudadEntity = await ciudadRepository.findOne({ where: { id: ciudad.id } })
    expect(deletedCategoria).toBeNull();
  });

  it('delete should throw an exception for an invalid ciudad', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await ciudadService.delete(ciudad.id);
    await expect(() => ciudadService.delete("0")).rejects.toHaveProperty("message", "The ciudad with the given id was not found")
  });
});
