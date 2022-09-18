import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { SupermercadoDto } from 'src/supermercado/supermercado.dto';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';

@Controller('supermercados')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoCiudadController {
    constructor(
        private readonly supermercadoCiudadService: SupermercadoCiudadService
    ){}

    @Post(':ciudadId/supermercados/:supermercadoId')
    async addSupermercadoToCiudad(@Param('supermercadoId') supermercadoId: string, @Param('ciudadId') ciudadId: string){
        return await this.supermercadoCiudadService.addSupermercadoToCiudad(supermercadoId, ciudadId);
    }

    @Get(':ciudadId/supermercados')
    async findSupermercadosFromCiudad(@Param('ciudadId') ciudadId: string){
        return await this.supermercadoCiudadService.findSupermercadosFromCiudad(ciudadId);
    }

    @Get(':ciudadId/supermercados/:supermercadoId')
    async findSupermercadoFromCiudad(@Param('supermercadoId') supermercadoId: string, @Param('ciudadId') ciudadId: string){
        return await this.supermercadoCiudadService.findSupermercadoFromCiudad(supermercadoId, ciudadId);
    }

    @Put(':ciudadId/supermercados')
    async updateSupermercadosFromCiudad(@Param('ciudadId') ciudadId: string, @Body() supermercadosDto: SupermercadoDto[]){
        const supermercados = plainToInstance(SupermercadoEntity, supermercadosDto)
        return await this.supermercadoCiudadService.updateSupermercadosFromCiudad(ciudadId, supermercados);
    }
    
    @Delete(':ciudadId/supermercados/:supermercadoId')
    @HttpCode(204)
    async deleteSupermercadoFromCiudad(@Param('supermercadoId') supermercadoId: string, @Param('ciudadId') ciudadId: string){
        return await this.supermercadoCiudadService.deleteSupermercadoFromCiudad(supermercadoId, ciudadId);
    }
}
