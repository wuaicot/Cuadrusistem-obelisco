import api from './api';
import type { TurnoTipo } from '../types/enums'; // Assuming direct import is okay for types

export interface Turno {
  id: string;
  tipo: TurnoTipo;
  fecha: string; // Assuming date string
}

export const fetchTurnos = async (): Promise<Turno[]> => {
  try {
    const response = await api.get('/turnos');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching turnos:", error);
    return [];
  }
};
