import api from './api';

export interface IngredienteDef {
  id: string; // Corrected from 'codigo' to 'id'
  nombreVisible: string;
}

export const fetchIngredientes = async (): Promise<IngredienteDef[]> => {
  try {
    const response = await api.get<IngredienteDef[]>('/ingredientes');
    return response.data;
  } catch (error) {
    console.error('Error fetching ingredientes:', error);
    throw error;
  }
};
