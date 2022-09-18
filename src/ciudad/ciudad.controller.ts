import { Controller } from '@nestjs/common';
import { CiudadService } from './ciudad.service';

@Controller('ciudad')
export class CiudadController {
    constructor(
        private readonly ciudadService: CiudadService
    ){}
}
