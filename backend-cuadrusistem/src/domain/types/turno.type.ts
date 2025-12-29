import { TurnoTipo } from '../enums/turno.enum';

export type Turno = {
  id: string;
  fecha: string; // YYYY-MM-DD
  tipo: TurnoTipo;
  localId: string;
  cerrado: boolean;
};
