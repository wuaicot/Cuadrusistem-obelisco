import { Segmento, TipoPlanilla } from '../enums/planilla.enum';

export type Marcacion = {
  segmento: Segmento;
  valores: number[];
};

export type PlanillaItem = {
  producto: string;
  marcaciones: Marcacion[];
};

export type Planilla = {
  id: string;
  turnoId: string;
  tipo: TipoPlanilla;
  usuarioId: string;
  enviada: boolean;
  items: PlanillaItem[];
};
