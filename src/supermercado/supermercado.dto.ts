import {IsNotEmpty, IsNumber, IsString, IsUrl} from 'class-validator';
export class SupermercadoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly longitud: string;

  @IsString()
  @IsNotEmpty()
  readonly latitud: string;

  @IsUrl()
  @IsNotEmpty()
  readonly pag_web: string;
}