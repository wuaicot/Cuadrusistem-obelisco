import { IsUUID, IsNotEmpty } from 'class-validator';

export class ProcessCuadreDto {
  @IsUUID()
  @IsNotEmpty()
  reporteZId: string;

  @IsUUID()
  @IsNotEmpty()
  planillaCocinaId: string;

  @IsUUID()
  @IsNotEmpty()
  planillaCajaId: string;
}
