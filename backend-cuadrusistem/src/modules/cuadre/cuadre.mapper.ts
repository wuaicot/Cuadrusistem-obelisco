import { CuadreEntity } from './cuadre.entity';
import { LocalEntity } from '../locales/local.entity';
import { ReporteZEntity } from '../reporte-z/reporte-z.entity';
import { PlanillaEntity } from '../planillas/planilla.entity';

import { TurnoTipo } from '../../domain/enums/turno.enum';
import { CuadreEstado } from '../../domain/enums/cuadre-estado.enum';

export interface CuadreDominioResultado {
  estado: CuadreEstado;
  detalle: Record<
    string,
    {
      teorico: number;
      real: number;
      diferencia: number;
    }
  >;
}

export class CuadreMapper {
  static toEntity(params: {
    fechaOperacion: string;
    turno: TurnoTipo;
    local: LocalEntity;
    reporteZ: ReporteZEntity;
    planillaCocina: PlanillaEntity;
    planillaCaja: PlanillaEntity;
    resultado: CuadreDominioResultado;
    recalculado?: boolean;
  }): CuadreEntity {
    const cuadre = new CuadreEntity();

    cuadre.fechaOperacion = params.fechaOperacion;
    cuadre.turno = params.turno;
    cuadre.local = params.local;

    cuadre.reporteZ = params.reporteZ;
    cuadre.planillaCocina = params.planillaCocina;
    cuadre.planillaCaja = params.planillaCaja;

    cuadre.estado = params.resultado.estado;
    cuadre.detalle = params.resultado.detalle;

    cuadre.recalculado = params.recalculado ?? false;

    return cuadre;
  }
}
