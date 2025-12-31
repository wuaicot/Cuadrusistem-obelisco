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
  turno: { id: string; tipo: string }; // Simplified turno type
  local: { id: string; nombre: string }; // Simplified local type
  archivoOriginal: string;
  items: ReporteZItem[];
  checksum: string;
  procesado: boolean;
  cargadoPor: string;
  created_at: string;
  updated_at: string;
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
