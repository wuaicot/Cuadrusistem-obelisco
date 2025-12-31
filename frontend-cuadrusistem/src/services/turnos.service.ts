import api from './api';
import { TurnoTipo } from '../../../backend-cuadrusistem/src/domain/enums/turno.enum'; // Assuming direct import is okay for types

export interface Turno {
  id: string;
  tipo: TurnoTipo;
  fecha: string; // Assuming date string
}

export const fetchTurnos = async (): Promise<Turno[]> => {
  const response = await api.get('/turnos'); // Assuming /turnos endpoint exists
  return response.data;
};
