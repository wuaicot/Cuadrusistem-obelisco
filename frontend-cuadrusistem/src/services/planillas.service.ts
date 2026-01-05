import api from './api';
import type { TipoPlanilla } from '../types/enums'; // Import from frontend types

// Updated: This interface now matches the detailed structure from the UI and backend
export interface PlanillaItem {
  ingrediente: string; // Codigo del ingrediente
  segmento: string;    // e.g., 'SALDO_INICIAL', 'ENTRADA', etc.
  cantidad: number;
}

export interface Planilla {
  id: string;
  tipo: TipoPlanilla;
  fecha: string;
  local: { id: string; nombre: string }; // Simplified local type
  turno: { id: string; tipo: string }; // Simplified turno type
  items: PlanillaItem[]; // This now uses the detailed item type
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
  items: PlanillaItem[]; // This uses the detailed item type
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
  // The frontend now sends a POST to /api/planillas, which we added the /api prefix for in the api.ts config
  const response = await api.post('/planillas', payload);
  return response.data;
};
