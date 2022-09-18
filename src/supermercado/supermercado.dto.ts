import {IsNotEmpty, IsNumber, IsString, IsUrl} from 'class-validator';
export class CategoriaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly pais: string;

  @IsNumber()
  @IsNotEmpty()
  readonly longitud: number;

  @IsNumber()
  @IsNotEmpty()
  readonly latitud: number;

  @IsUrl()
  @IsNotEmpty()
  readonly pag_web: string;
}