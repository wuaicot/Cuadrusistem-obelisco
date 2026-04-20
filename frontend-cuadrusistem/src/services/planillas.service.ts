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
  local_nombre: string;
  turno_tipo: string;
}

export interface CreatePlanillaPayload {
  fecha: string;
  tipo: TipoPlanilla;
  turnoId: string;
  localId: string;
  estado: 'BORRADOR' | 'ENVIADO'; // Nuevo campo
  items: PlanillaItem[];
}

export const fetchPlanillas = async (): Promise<Planilla[]> => {
  try {
    const response = await api.get('/planillas');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching planillas:", error);
    return [];
  }
};

export const fetchPlanillasByType = async (
  type: TipoPlanilla,
  localId?: string,
  turnoId?: string,
): Promise<Planilla[]> => {
  try {
    let url = `/planillas?tipo=${type}`;
    if (localId) {
      url += `&localId=${localId}`;
    }
    if (turnoId) {
      url += `&turnoId=${turnoId}`;
    }
    const response = await api.get(url);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Error fetching planillas of type ${type}:`, error);
    return [];
  }
};

export const createPlanilla = async (payload: CreatePlanillaPayload): Promise<Planilla> => {
  // The frontend now sends a POST to /api/planillas, which we added the /api prefix for in the api.ts config
  const response = await api.post('/planillas', payload);
  return response.data;
};

export const fetchSaldoAnterior = async (
  localId: string,
  turnoId: string,
  tipo: TipoPlanilla,
): Promise<Record<string, number>> => {
  try {
    const response = await api.get(`/planillas/saldo-anterior?localId=${localId}&turnoId=${turnoId}&tipo=${tipo}`);
    return response.data || {};
  } catch (error) {
    console.error("Error fetching previous balance:", error);
    return {};
  }
};

export const fetchPlanillaItems = async (
  localId: string,
  fecha: string,
  turnoId: string,
  tipo: TipoPlanilla,
): Promise<{ items: PlanillaItem[], estado: string | null }> => {
  try {
    const response = await api.get(`/planillas/items?localId=${localId}&fecha=${fecha}&turnoId=${turnoId}&tipo=${tipo}`);
    return response.data || { items: [], estado: null };
  } catch (error) {
    console.error("Error fetching current planilla items:", error);
    return { items: [], estado: null };
  }
};
