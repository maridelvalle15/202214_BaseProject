import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';

@Injectable()
export class CiudadService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>
    ){}

    async findAll(): Promise<CiudadEntity[]> {
        return true;
    }

    async findOne(id: string): Promise<CiudadEntity[]> {
        return true;
    }

    async create(ciudad: CiudadEntity): Promise<CiudadEntity[]> {
        return true;
    }

    async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity[]> {
        return true;
    }

    async delete(id: string) {
        return true;
    }
}
