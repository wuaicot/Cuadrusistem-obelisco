import { Ingrediente } from './ingrediente.enum';
import { IngredienteDef } from './ingrediente.type';

export const INGREDIENTES_MASTER: Record<Ingrediente, IngredienteDef> = {
  [Ingrediente.PAN_MESA_SUPER_GIGAN]: {
    codigo: Ingrediente.PAN_MESA_SUPER_GIGAN,
    nombreVisible: 'Pan mesa súper Gigan',
  },

  [Ingrediente.VIENESA_PERSONAL]: {
    codigo: Ingrediente.VIENESA_PERSONAL,
    nombreVisible: 'Vienesa personal',
  },

  [Ingrediente.COCA_COLA_LATA]: {
    codigo: Ingrediente.COCA_COLA_LATA,
    nombreVisible: 'Coca-Cola lata',
  },

  [Ingrediente.COCA_COLA_591CC]: {
    codigo: Ingrediente.COCA_COLA_591CC,
    nombreVisible: 'Coca-Cola 591cc',
  },

  [Ingrediente.AGUA_SIN_GAS]: {
    codigo: Ingrediente.AGUA_SIN_GAS,
    nombreVisible: 'Agua sin gas',
  },

  [Ingrediente.MASA_EMP_EMP]: {
    codigo: Ingrediente.MASA_EMP_EMP,
    nombreVisible: 'Masa empanada',
  },

  [Ingrediente.PINO_CARNE]: {
    codigo: Ingrediente.PINO_CARNE,
    nombreVisible: 'Pino de carne',
  },

  [Ingrediente.QUESO_EMP]: {
    codigo: Ingrediente.QUESO_EMP,
    nombreVisible: 'Queso empanada',
  },
};
