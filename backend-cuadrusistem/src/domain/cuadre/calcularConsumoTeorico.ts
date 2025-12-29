import { CatalogoProcesado, ItemCatalogo } from '../catalogo/catalogo.factory';

export type VentasZ = Map<string, number>;
export type ConsumoTeorico = Map<string, number>;

/**
 * Calcula el consumo teórico de ingredientes
 * en base a las ventas y el catálogo procesado.
 *
 * ⚠️ No depende de entidades de dominio (Producto, Ingrediente)
 * ⚠️ No contiene lógica de negocio externa
 */
export function calcularConsumoTeorico(
  ventasZ: VentasZ,
  catalogo: CatalogoProcesado,
): ConsumoTeorico {
  const consumo: ConsumoTeorico = new Map();

  for (const [codigoProducto, cantidadVendida] of ventasZ.entries()) {
    const item: ItemCatalogo | undefined = catalogo.get(codigoProducto);

    if (!item) {
      console.warn(
        `[Cuadre] Código no encontrado en catálogo: ${codigoProducto}`,
      );
      continue;
    }

    // =========================
    // PRODUCTOS SIN RECETA (bebestibles)
    // =========================
    if (!item.receta || item.receta.length === 0) {
      // No consumen ingredientes → se ignoran
      continue;
    }

    // =========================
    // PRODUCTOS CON RECETA
    // =========================
    for (const recetaItem of item.receta) {
      validarIngrediente(recetaItem.ingrediente);

      acumular(
        consumo,
        recetaItem.ingrediente,
        recetaItem.cantidad * cantidadVendida,
      );
    }
  }

  return consumo;
}

// =========================
// Helpers
// =========================

function acumular(
  map: Map<string, number>,
  clave: string,
  cantidad: number,
): void {
  map.set(clave, (map.get(clave) ?? 0) + cantidad);
}

function validarIngrediente(nombreIngrediente: string): void {
  if (!nombreIngrediente || nombreIngrediente.trim() === '') {
    console.warn('[Cuadre] Ingrediente sin nombre detectado');
  }
}
