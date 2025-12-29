import { IsDateString, IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { TurnoTipo } from '../../../domain/enums/turno.enum';

export class CreateReporteZDto {
  @IsDateString()
  fechaOperacion: string;

  @IsEnum(TurnoTipo)
  turno: TurnoTipo;

  @IsString()
  @IsNotEmpty()
  localId: string;
}
