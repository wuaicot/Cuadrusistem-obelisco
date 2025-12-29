import { Ingrediente } from '../ingrediente/ingrediente.entity';

/**
 * Relación ingrediente ↔ cantidad dentro de una receta
 */
export type IngredienteReceta = {
  ingrediente: Ingrediente;
  cantidad: number;
};

/**
 * Producto vendible según POS (Reporte Z)
 * Puede ser menú, empanada o bebestible.
 */
export class Producto {
  readonly codigo: string;
  readonly nombre: string;
  readonly seccion: 'BAR' | 'COCINA' | 'EMPANADAS';
  readonly receta?: IngredienteReceta[];

  constructor(params: {
    codigo: string;
    nombre: string;
    seccion: 'BAR' | 'COCINA' | 'EMPANADAS';
    receta?: IngredienteReceta[];
  }) {
    if (!params.codigo) {
      throw new Error('Producto debe tener código POS');
    }

    this.codigo = params.codigo;
    this.nombre = params.nombre;
    this.seccion = params.seccion;

    // Solo cocina y empanadas pueden tener receta
    if (params.receta && params.seccion === 'BAR') {
      throw new Error('Un bebestible no puede tener receta');
    }

    this.receta = params.receta;
  }

  /**
   * Calcula ingredientes teóricos según cantidad vendida
   */
  calcularConsumo(cantidadVendida: number): IngredienteReceta[] {
    if (!this.receta) return [];

    return this.receta.map((item) => ({
      ingrediente: item.ingrediente,
      cantidad: item.cantidad * cantidadVendida,
    }));
  }
}
