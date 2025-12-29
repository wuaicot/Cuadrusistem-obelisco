import { Ingrediente } from '../ingrediente/ingrediente.enum';
import { PlanillaOperativa } from './planilla-operativa.entity';

export type ConsumoReal = Map<Ingrediente, number>;

export function calcularConsumoReal(
  planillas: PlanillaOperativa[],
): ConsumoReal {
  const consumo: ConsumoReal = new Map();

  for (const planilla of planillas) {
    for (const registro of planilla.registros) {
      consumo.set(
        registro.ingrediente,
        (consumo.get(registro.ingrediente) ?? 0) + registro.cantidad,
      );
    }
  }

  return consumo;
}
