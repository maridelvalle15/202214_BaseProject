import { Controller, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CiudadService } from './ciudad.service';

@Controller('ciudad')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
    constructor(
        private readonly ciudadService: CiudadService
    ){}
}
