import api from "./api";

export interface ProcessCuadrePayload {
  reporteZId: string;
  planillaCocinaId: string;
  planillaCajaId: string;
}

export interface CuadreResult {
  detalle: Record<
    string,
    { teorico: number; real: number; diferencia: number }
  >;
}

export const processCuadre = async (
  payload: ProcessCuadrePayload
): Promise<CuadreResult> => {
  const response = await api.post("/cuadre", payload);
  return response.data;
};
