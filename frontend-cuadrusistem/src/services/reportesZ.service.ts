import api from './api';

export interface ReporteZItem {
  codigo: string;
  nombre: string;
  cantidad: number;
  seccion: string;
}

export interface ReporteZ {
  id: string;
  fechaOperacion: string;
  archivoOriginal: string;
  checksum: string;
  procesado: boolean;
  local_nombre: string;
  turno_tipo: string;
}

export const fetchUnprocessedReportesZ = async (): Promise<ReporteZ[]> => {
  // Assuming a backend endpoint to fetch unprocessed ReporteZ exists
  const response = await api.get('/reporte-z?procesado=false');
  return response.data;
};

export const fetchAllReportesZ = async (): Promise<ReporteZ[]> => {
  const response = await api.get('/reporte-z');
  return response.data;
};
