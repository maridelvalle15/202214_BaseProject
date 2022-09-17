import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CiudadModule } from './ciudad/ciudad.module';
import { SupermercadoModule } from './supermercado/supermercado.module';
import { SupermercadoCiudadModule } from './supermercado-ciudad/supermercado-ciudad.module';

@Module({
  imports: [CiudadModule, SupermercadoModule, SupermercadoCiudadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
