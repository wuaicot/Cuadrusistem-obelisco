import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CuadreEntity } from './cuadre.entity';
import { ReporteZEntity } from '../reporte-z/reporte-z.entity';
import { PlanillaEntity } from '../planillas/planilla.entity';

import { calcularConsumoTeorico } from '../../domain/cuadre/calcularConsumoTeorico';
import { CATALOGO_BASE } from '../../domain/catalogo/catalogo.base';
import { CuadreEstado } from '../../domain/enums/cuadre-estado.enum';
import { CatalogoProcesado } from '../../domain/catalogo/catalogo.factory';

@Injectable()
export class CuadrarTurnoService {
  constructor(
    @InjectRepository(CuadreEntity)
    private readonly cuadreRepo: Repository<CuadreEntity>,

    @InjectRepository(ReporteZEntity)
    private readonly reporteZRepo: Repository<ReporteZEntity>,

    @InjectRepository(PlanillaEntity)
    private readonly planillaRepo: Repository<PlanillaEntity>,
  ) {}

  async ejecutar(params: {
    reporteZ: ReporteZEntity;
    planillaCocina: PlanillaEntity;
    planillaCaja: PlanillaEntity;
  }): Promise<CuadreEntity> {
    const { reporteZ, planillaCocina, planillaCaja } = params;

    /**
     * 1️⃣ Ventas por código
     */
    const ventasPorCodigo = new Map<string, number>();
    for (const item of reporteZ.items) {
      ventasPorCodigo.set(
        item.codigo,
        (ventasPorCodigo.get(item.codigo) ?? 0) + item.cantidad,
      );
    }

    /**
     * 2️⃣ Consumo teórico
     */
    const catalogo: CatalogoProcesado = CATALOGO_BASE;
    const consumoTeorico = calcularConsumoTeorico(ventasPorCodigo, catalogo);

    /**
     * 3️⃣ Consumo Real
     */
    const consumoReal = new Map<string, number>();
    const planillas = [planillaCocina, planillaCaja];

    for (const planilla of planillas) {
      if (planilla.items) {
        for (const item of planilla.items) {
          consumoReal.set(
            item.ingrediente,
            (consumoReal.get(item.ingrediente) ?? 0) + item.cantidad,
          );
        }
      }
    }

    /**
     * 4️⃣ Construcción del detalle
     */
    const detalle: Record<
      string,
      { teorico: number; real: number; diferencia: number }
    > = {};

    const allIngredientes = new Set([
      ...consumoTeorico.keys(),
      ...consumoReal.keys(),
    ]);

    for (const ingrediente of allIngredientes) {
      const teorico = consumoTeorico.get(ingrediente) ?? 0;
      const real = consumoReal.get(ingrediente) ?? 0;
      const diferencia = real - teorico;

      detalle[ingrediente] = {
        teorico,
        real,
        diferencia,
      };
    }

    /**
     * 5️⃣ Estado del cuadre
     */
    const hayFaltantes = Object.values(detalle).some((d) => d.diferencia < 0);
    const haySobrantes = Object.values(detalle).some((d) => d.diferencia > 0);

    let estado: CuadreEstado = CuadreEstado.CUADRADO;
    if (hayFaltantes && haySobrantes) {
      estado = CuadreEstado.MIXTO;
    } else if (hayFaltantes) {
      estado = CuadreEstado.FALTANTE;
    } else if (haySobrantes) {
      estado = CuadreEstado.SOBRANTE;
    }

    /**
     * 6️⃣ Persistencia
     */
    const cuadre = this.cuadreRepo.create({
      fechaOperacion: reporteZ.fechaOperacion,
      turno: reporteZ.turno,
      local: reporteZ.local,
      reporteZ,
      planillaCocina,
      planillaCaja,
      estado,
      detalle,
      recalculado: false,
    });

    reporteZ.procesado = true;
    await this.reporteZRepo.save(reporteZ);

    return this.cuadreRepo.save(cuadre);
  }
}
