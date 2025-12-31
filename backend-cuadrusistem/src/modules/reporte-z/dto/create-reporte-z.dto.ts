import { IsDateString, IsEnum, IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { TurnoTipo } from '../../../domain/enums/turno.enum';

export class CreateReporteZDto {
  @IsDateString()
  fechaOperacion: string;

  @IsUUID()
  @IsNotEmpty()
  turnoId: string;

  @IsString()
  @IsNotEmpty()
  localId: string;
}
