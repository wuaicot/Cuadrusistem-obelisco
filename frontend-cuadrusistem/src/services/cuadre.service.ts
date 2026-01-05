import api from "./api";
import type { CuadreEstado } from "../types/enums";

export interface ProcessCuadrePayload {
  reporteZId: string;
  planillaCocinaId: string;
  planillaCajaId: string;
}

export interface CuadreResult {
  id: string;
  fechaOperacion: string;
  turno: { id: string; tipo: string };
  local: { id: string; nombre: string };
  reporteZ: { id: string };
  planillaCocina: { id: string };
  planillaCaja: { id: string };
  estado: CuadreEstado;
  detalle: Record<
    string,
    { teorico: number; real: number; diferencia: number }
  >;
  recalculado: boolean;
  created_at: string;
  updated_at: string;
}

export const processCuadre = async (
  payload: ProcessCuadrePayload
): Promise<CuadreResult> => {
  const response = await api.post("/cuadre/process", payload);
  return response.data;
};
