import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';

@Injectable()
export class CiudadService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,
        private readonly paises: string[]
    ){
        this.paises = ["Argentina", "Ecuador", "Paraguay"];
    }

    async findAll(): Promise<CiudadEntity[]> {
        return await this.ciudadRepository.find({relations: ["supermercados"]})
    }

    async findOne(id: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}, relations: ["supermercados"]});

        if (!ciudad)
            throw new BusinessLogicException("The ciudad with the given id was not found", BusinessError.NOT_FOUND);

        return ciudad;
    }

    async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
        let nombre = ciudad.nombre;
        let valid_pais = this.paises.includes(nombre);

        if (!valid_pais) {
            throw new BusinessLogicException("The given pais for ciudad is not valid", BusinessError.PRECONDITION_FAILED);
        }
        return await this.ciudadRepository.save(ciudad);
    }

    async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
        let nombre = ciudad.nombre;
        let valid_pais = this.paises.includes(nombre);

        if (!valid_pais) {
            throw new BusinessLogicException("The given pais for ciudad is not valid", BusinessError.PRECONDITION_FAILED);
        }
        
        const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}});

        if (!persistedCiudad)
            throw new BusinessLogicException("The ciudad with the given id was not found", BusinessError.NOT_FOUND);

        return await this.ciudadRepository.save({...persistedCiudad, ...ciudad});
    }

    async delete(id: string) {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}});

        if (!ciudad)
            throw new BusinessLogicException("The ciudad with the given id was not found", BusinessError.NOT_FOUND);

        return await this.ciudadRepository.remove(ciudad);

    }
}
