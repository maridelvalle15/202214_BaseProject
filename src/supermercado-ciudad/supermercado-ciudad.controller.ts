import { Controller } from '@nestjs/common';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';

@Controller('supermercado-ciudad')
export class SupermercadoCiudadController {
    constructor(
        private readonly supermercadoCiudadService: SupermercadoCiudadService
    ){}
}
