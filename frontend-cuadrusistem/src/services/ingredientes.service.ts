import api from './api';
import type { Role } from '../store/useRoleStore';

export interface IngredienteDef {
  id: string; // Corrected from 'codigo' to 'id'
  nombreVisible: string;
}

export const fetchIngredientes = async (tipo: Role): Promise<IngredienteDef[]> => {
  try {
    const response = await api.get<IngredienteDef[]>('/ingredientes', {
      params: { tipo }
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Error fetching ingredientes for tipo '${tipo}':`, error);
    return [];
  }
};
