import { Entity, PrimaryColumn, Column } from 'typeorm';

/**
 * Relación ingrediente ↔ cantidad dentro de una receta
 */
export type IngredienteReceta = {
  ingrediente: any; // Simplified for JSONB storage, can be string code.
  cantidad: number;
};

/**
 * Producto vendible según POS (Reporte Z)
 * Puede ser menú, empanada o bebestible.
 */
@Entity({ name: 'productos' })
export class ProductoEntity {
  @PrimaryColumn()
  codigo: string;

  @Column()
  nombre: string;

  @Column({ type: 'text' }) // Using 'text' is safer for enums that might change
  seccion: 'BAR' | 'COCINA' | 'EMPANADAS';

  @Column({ type: 'jsonb', nullable: true })
  receta?: IngredienteReceta[];

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

