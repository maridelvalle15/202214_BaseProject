import { Controller, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { SupermercadoService } from './supermercado.service';

@Controller('supermercado')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
    constructor(
        private readonly supermercadoService: SupermercadoService
    ){}
}
