// src/domain/types/reporte-z.type.ts
import { SeccionZ } from '../enums/reporte-z.enum';

export type ItemReporteZ = {
  codigo: string;
  nombre: string;
  cantidad: number;
  seccion: SeccionZ;
};

export type ReporteZ = {
  id: string;
  turnoId: string;
  items: ItemReporteZ[];
  procesado: boolean;
};
