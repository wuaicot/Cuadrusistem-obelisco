// src/domain/catalogo/catalogo.factory.ts

export type TipoProducto = 'BEBESTIBLE' | 'MENU' | 'EMPANADA';

export type ItemCatalogo = {
  tipo: TipoProducto;
  nombre: string;
  receta?: {
    ingrediente: string;
    cantidad: number;
  }[];
};

export type CatalogoProcesado = Map<string, ItemCatalogo>;

/**
 * Factory responsable de construir el catálogo
 * que utiliza el motor de cuadre.
 *
 * NO expone entidades de dominio pesado.
 * NO contiene lógica de negocio.
 * Solo normaliza datos.
 */
export class CatalogoFactory {
  static crearCatalogo(): CatalogoProcesado {
    return new Map();
  }

  static agregarProductoMenu(
    catalogo: CatalogoProcesado,
    params: {
      codigo: string;
      nombre: string;
      ingredientes: { nombre: string; cantidad: number }[];
    },
  ): void {
    catalogo.set(params.codigo, {
      tipo: 'MENU',
      nombre: params.nombre,
      receta: params.ingredientes.map((i) => ({
        ingrediente: i.nombre,
        cantidad: i.cantidad,
      })),
    });
  }

  static agregarProductoEmpanada(
    catalogo: CatalogoProcesado,
    params: {
      codigo: string;
      nombre: string;
      ingredientes: { nombre: string; cantidad: number }[];
    },
  ): void {
    catalogo.set(params.codigo, {
      tipo: 'EMPANADA',
      nombre: params.nombre,
      receta: params.ingredientes.map((i) => ({
        ingrediente: i.nombre,
        cantidad: i.cantidad,
      })),
    });
  }

  static agregarProductoBebestible(
    catalogo: CatalogoProcesado,
    params: {
      codigo: string;
      nombre: string;
    },
  ): void {
    catalogo.set(params.codigo, {
      tipo: 'BEBESTIBLE',
      nombre: params.nombre,
    });
  }
}
