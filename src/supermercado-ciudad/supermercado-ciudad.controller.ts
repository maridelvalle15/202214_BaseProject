import { Controller, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';

@Controller('supermercado-ciudad')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoCiudadController {
    constructor(
        private readonly supermercadoCiudadService: SupermercadoCiudadService
    ){}
}
