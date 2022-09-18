import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from './supermercado.entity';

@Injectable()
export class SupermercadoService {
    constructor(
        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>
    ){}

    async findAll(): Promise<SupermercadoEntity[]> {
        return await this.supermercadoRepository.find({relations: ["ciudades"]})
    }

    async findOne(id: string): Promise<SupermercadoEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id}, relations: ["ciudades"]});

        if (!supermercado)
            throw new BusinessLogicException("The supermercado with the given id was not found", BusinessError.NOT_FOUND);

        return supermercado;
    }

    async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        let nombre_length = supermercado.nombre.length;

        if (nombre_length <= 10) {
            throw new BusinessLogicException("The length of the supermercado name is not valid", BusinessError.PRECONDITION_FAILED);
        }
        return await this.supermercadoRepository.save(supermercado);
    }

    async update(id: string, supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        let nombre_length = supermercado.nombre.length;

        if (nombre_length <= 10) {
            throw new BusinessLogicException("The length of the supermercado name is not valid", BusinessError.PRECONDITION_FAILED);
        }
        
        const persistedSupermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id}});

        if (!persistedSupermercado)
            throw new BusinessLogicException("The supermercado with the given id was not found", BusinessError.NOT_FOUND);

        return await this.supermercadoRepository.save({...persistedSupermercado, ...supermercado});
    }

    async delete(id: string) {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id}});

        if (!supermercado)
            throw new BusinessLogicException("The supermercado with the given id was not found", BusinessError.NOT_FOUND);

        return await this.supermercadoRepository.remove(supermercado);

    }
}
