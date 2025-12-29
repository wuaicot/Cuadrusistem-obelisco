import api from '../services/api';

export interface Local {
  id: string;
  nombre: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export const fetchLocales = async (): Promise<Local[]> => {
  const response = await api.get<Local[]>('/locales');
  return response.data;
};
