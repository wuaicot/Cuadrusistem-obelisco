import { RegistroPlanilla } from './planilla-operativa.type';

export class PlanillaOperativa {
  readonly fecha: Date;
  readonly area: 'COCINA' | 'EMPANADAS' | 'BAR';
  readonly registros: RegistroPlanilla[];

  constructor(params: {
    fecha: Date;
    area: 'COCINA' | 'EMPANADAS' | 'BAR';
    registros: RegistroPlanilla[];
  }) {
    this.fecha = params.fecha;
    this.area = params.area;
    this.registros = params.registros;
  }
}
