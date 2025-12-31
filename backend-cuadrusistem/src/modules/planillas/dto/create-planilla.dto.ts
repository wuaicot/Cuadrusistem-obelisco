import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoPlanilla } from '../../../domain/enums/planilla.enum';

export class PlanillaItemDto {
  @IsString()
  @IsNotEmpty()
  ingrediente: string;

  @IsNumber()
  cantidad: number;
}

export class CreatePlanillaDto {
  @IsDateString()
  fecha: string;

  @IsEnum(TipoPlanilla)
  tipo: TipoPlanilla;

  @IsString()
  @IsNotEmpty()
  turnoId: string;

  @IsString()
  @IsNotEmpty()
  localId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanillaItemDto)
  items: PlanillaItemDto[];
}
