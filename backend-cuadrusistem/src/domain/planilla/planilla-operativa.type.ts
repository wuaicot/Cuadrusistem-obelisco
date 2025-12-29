import { Ingrediente } from '../ingrediente/ingrediente.enum';

export type RegistroPlanilla = {
  ingrediente: Ingrediente;
  cantidad: number; // unidades
};
