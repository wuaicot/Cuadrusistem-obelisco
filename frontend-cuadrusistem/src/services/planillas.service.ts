import api from './api';
import { TipoPlanilla } from '../types/enums'; // Import from frontend types

export interface PlanillaItem {
  ingrediente: string;
  cantidad: number;
}

export interface Planilla {
  id: string;
  tipo: TipoPlanilla;
  fecha: string;
  local: { id: string; nombre: string }; // Simplified local type
  turno: { id: string; tipo: string }; // Simplified turno type
  items: PlanillaItem[];
  totalDeclarado: number;
  cerrada: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePlanillaPayload {
  fecha: string;
  tipo: TipoPlanilla;
  turnoId: string;
  localId: string;
  items: PlanillaItem[];
}

export const fetchPlanillas = async (): Promise<Planilla[]> => {
  const response = await api.get('/planillas');
  return response.data;
};

export const fetchPlanillasByType = async (
  type: TipoPlanilla,
  localId?: string,
  turnoId?: string,
): Promise<Planilla[]> => {
  let url = `/planillas?tipo=${type}`;
  if (localId) {
    url += `&localId=${localId}`;
  }
  if (turnoId) {
    url += `&turnoId=${turnoId}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const createPlanilla = async (payload: CreatePlanillaPayload): Promise<Planilla> => {
  const response = await api.post('/planillas', payload);
  return response.data;
};
