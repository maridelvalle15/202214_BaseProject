import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../../supermercado/supermercado.entity';

const entitiesArray = [CiudadEntity, SupermercadoEntity];

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: entitiesArray,
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature(entitiesArray),
];
