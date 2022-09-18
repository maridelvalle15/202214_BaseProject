import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';

describe('SupermercadoCiudadService', () => {
  let supermercadoCiudadService: SupermercadoCiudadService;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadosList: SupermercadoEntity[];
  let ciudadesList: CiudadEntity[];
  let ciudad: CiudadEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoCiudadService],
    }).compile();

    supermercadoCiudadService = module.get<SupermercadoCiudadService>(SupermercadoCiudadService);
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();

    supermercadosList = [];
    for(let i = 0; i < 5; i++){
      const supermercado: SupermercadoEntity = await supermercadoRepository.save({
        nombre: faker.lorem.sentence(3),
        longitud: "74°04'51''",
        latitud: "4° 35'56''",
        pag_web: faker.internet.domainName()
      })
      supermercadosList.push(supermercado);
    }

    ciudadesList = [];
    for(let i = 0; i < 5; i++){
      const ciudad: CiudadEntity = await ciudadRepository.save({
        nombre: faker.address.cityName(), 
        pais: "Argentina",
        num_habitantes: Math.random(),
        supermercados: supermercadosList
      })
      ciudadesList.push(ciudad);
    }
  }

  it('should be defined', () => {
    expect(supermercadoCiudadService).toBeDefined();
  });

  it('addSupermercadoToCiudad should add a supermercado to a ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: "varios caracteres",
      longitud: "74°04'51''",
      latitud: "4° 35'56''",
      pag_web: faker.internet.domainName()
    });

    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.address.cityName(), 
      pais: "Argentina",
      num_habitantes: Math.random(),
      supermercados: []
    })

    const result: CiudadEntity = await supermercadoCiudadService.addSupermercadoToCiudad(newSupermercado.id, newCiudad.id);
    
    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(newSupermercado.nombre)
    expect(result.supermercados[0].longitud).toBe(newSupermercado.longitud)
    expect(result.supermercados[0].latitud).toBe(newSupermercado.latitud)
    expect(result.supermercados[0].pag_web).toBe(newSupermercado.pag_web)
  });

  it('addSupermercadoToCiudad should thrown exception for an invalid supermercado', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.address.cityName(), 
      pais: "Argentina",
      num_habitantes: Math.random(),
      supermercados: supermercadosList
    })

    await expect(() => supermercadoCiudadService.addSupermercadoToCiudad("0", newCiudad.id)).rejects.toHaveProperty("message", "The supermercado with the given id was not found");
  });

  it('addSupermercadoToCiudad should throw an exception for an invalid ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(3),
      longitud: "74°04'51''",
      latitud: "4° 35'56''",
      pag_web: faker.internet.domainName()
    });

    await expect(() => supermercadoCiudadService.addSupermercadoToCiudad(newSupermercado.id, "0")).rejects.toHaveProperty("message", "The ciudad with the given id was not found");
  });

  it('findSupermercadoFromCiudad should throw an exception for an invalid supermercado', async () => {
    await expect(()=> supermercadoCiudadService.findSupermercadoFromCiudad("0", ciudadesList[0].id)).rejects.toHaveProperty("message", "The supermercado with the given id was not found"); 
  });

  it('findSupermercadoFromCiudad should throw an exception for an invalid ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0]; 
    await expect(()=> supermercadoCiudadService.findSupermercadoFromCiudad(supermercado.id, "0")).rejects.toHaveProperty("message", "The ciudad with the given id was not found"); 
  });

  it('findSupermercadoFromCiudad should throw an exception for a supermercado not associated to the ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(3),
      longitud: "74°04'51''",
      latitud: "4° 35'56''",
      pag_web: faker.internet.domainName()
    });

    await expect(()=> supermercadoCiudadService.findSupermercadoFromCiudad(newSupermercado.id, ciudadesList[0].id)).rejects.toHaveProperty("message", "The supermercado with the given id is not associated to the ciudad"); 
  });

  it('findSupermercadosFromCiudad should return supermercados by ciudad', async ()=>{
    const supermercados: SupermercadoEntity[] = await supermercadoCiudadService.findSupermercadosFromCiudad(ciudadesList[0].id);
    expect(supermercados.length).toBe(5)
  });

  it('findSupermercadosFromCiudad should throw an exception for an invalid ciudad', async () => {
    await expect(()=> supermercadoCiudadService.findSupermercadosFromCiudad("0")).rejects.toHaveProperty("message", "The ciudad with the given id was not found"); 
  });

  it('updateSupermercadosFromCiudad should update artworks list for a museum', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(3),
      longitud: "74°04'51''",
      latitud: "4° 35'56''",
      pag_web: faker.internet.domainName()
    });

    const updatedCiudad: CiudadEntity = await supermercadoCiudadService.updateSupermercadosFromCiudad(ciudadesList[0].id, [newSupermercado]);
    expect(updatedCiudad.supermercados.length).toBe(1);

    expect(updatedCiudad.supermercados[0].nombre).toBe(newSupermercado.nombre);
    expect(updatedCiudad.supermercados[0].longitud).toBe(newSupermercado.longitud);
    expect(updatedCiudad.supermercados[0].latitud).toBe(newSupermercado.latitud);
    expect(updatedCiudad.supermercados[0].pag_web).toBe(newSupermercado.pag_web);
  });

  it('updateSupermercadosFromCiudad should throw an exception for an invalid ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(3),
      longitud: "74°04'51''",
      latitud: "4° 35'56''",
      pag_web: faker.internet.domainName()
    });

    await expect(()=> supermercadoCiudadService.updateSupermercadosFromCiudad("0", [newSupermercado])).rejects.toHaveProperty("message", "The ciudad with the given id was not found"); 
  });

  it('updateSupermercadosFromCiudad should throw an exception for an invalid producto', async () => {
    const newSupermercado: SupermercadoEntity = supermercadosList[0];
    newSupermercado.id = "0";

    await expect(()=> supermercadoCiudadService.updateSupermercadosFromCiudad(ciudadesList[0].id, [newSupermercado])).rejects.toHaveProperty("message", "The supermercado with the given id was not found"); 
  });

  it('deleteSupermercadoFromCiudad should remove a supermercado from a ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    
    await supermercadoCiudadService.deleteSupermercadoFromCiudad(supermercado.id, ciudadesList[0].id);

    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({where: {id: ciudadesList[0].id}, relations: ["supermercados"]});
    const deletedProducto: SupermercadoEntity = storedCiudad.supermercados.find(a => a.id === supermercado.id);

    expect(deletedProducto).toBeUndefined();

  });

  it('deleteSupermercadoFromCiudad should thrown an exception for an invalid supermercado', async () => {
    await expect(()=> supermercadoCiudadService.deleteSupermercadoFromCiudad("0", ciudadesList[0].id)).rejects.toHaveProperty("message", "The supermercado with the given id was not found"); 
  });

  it('deleteSupermercadoFromCiudad should thrown an exception for an invalid ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(()=> supermercadoCiudadService.deleteSupermercadoFromCiudad(supermercado.id, "0")).rejects.toHaveProperty("message", "The ciudad with the given id was not found"); 
  });

  it('deleteSupermercadoFromCiudad should thrown an exception for an non asocciated supermercado', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(3),
      longitud: "74°04'51''",
      latitud: "4° 35'56''",
      pag_web: faker.internet.domainName()
    });

    await expect(()=> supermercadoCiudadService.deleteSupermercadoFromCiudad(newSupermercado.id, ciudadesList[0].id)).rejects.toHaveProperty("message", "The supermercado with the given id is not associated to the ciudad"); 
  }); 
});
