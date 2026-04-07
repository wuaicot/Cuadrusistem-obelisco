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
  try {
    const response = await api.get('/reporte-z?procesado=false');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching unprocessed reportesZ:", error);
    return [];
  }
};

export const fetchAllReportesZ = async (): Promise<ReporteZ[]> => {
  try {
    const response = await api.get('/reporte-z');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching all reportesZ:", error);
    return [];
  }
};
