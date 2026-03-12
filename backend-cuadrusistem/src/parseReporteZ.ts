// import { recetas } from "./domain/recetas";
// import { canonicalPOS, correctCodeOcr } from "./utils/pos-canonical";

// type VentaMap = Map<string, number>;

// const validCodes = recetas.map((r) => r.codigo);

// export function parseReporteZ(text: string): VentaMap {

//   const ventas: VentaMap = new Map();

//   const normalized = canonicalPOS(text);

//   const lines = normalized
//     .split("\n")
//     .map((l) => l.trim())
//     .filter(Boolean);

//   for (const line of lines) {

//     // detectar código de artículo
//     const codeMatch = line.match(/^\d{3,4}/);
//     if (!codeMatch) continue;

//     const rawCode = codeMatch[0];
//     const code = correctCodeOcr(rawCode, validCodes);

//     // buscar número al final de línea
//     const qtyMatch = line.match(/(\d{1,3})\s*$/);
//     if (!qtyMatch) continue;

//     const cantidad = parseInt(qtyMatch[1]);

//     // filtrar cantidades absurdas
//     if (cantidad <= 0 || cantidad > 50) continue;

//     const prev = ventas.get(code) ?? 0;

//     ventas.set(code, prev + cantidad);
//   }

//   return ventas;
// }




/**
 * Parser robusto del Reporte Z
 *
 * Diseñado para tickets POS térmicos donde el OCR
 * frecuentemente corrompe los códigos.
 */

import { correctCodeOcr } from './utils/pos-canonical';
import * as recetasModule from './domain/recetas';

export type VentaZ = {
  codigo: string;
  cantidad: number;
};

type Receta = {
  codigo: string;
};

function getRecetasArray(): Receta[] {
  const mod: any = recetasModule;

  if (Array.isArray(mod.recetas)) return mod.recetas;
  if (Array.isArray(mod.RECETAS)) return mod.RECETAS;
  if (Array.isArray(mod.default)) return mod.default;

  throw new Error('No se encontró export válido de recetas');
}

const validCodes = getRecetasArray().map((r: Receta) => r.codigo);

export function parseReporteZ(textoZ: string): Map<string, number> {

  const ventas = new Map<string, number>();

  const lineas = textoZ
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  for (const linea of lineas) {

    /**
     * Detectar números al inicio de línea
     */
    const codigoMatch = linea.match(/^[A-Z0-9]{3,6}/);

    if (!codigoMatch) continue;

    let rawCode = codigoMatch[0];

    /**
     * limpiar OCR basura
     */
    rawCode = rawCode
      .replace(/J/g, '3')
      .replace(/O/g, '0')
      .replace(/I/g, '1')
      .replace(/\D/g, '');

    /**
     * si hay más de 4 dígitos
     * tomar los primeros
     */
    if (rawCode.length > 4) {
      rawCode = rawCode.substring(0,4);
    }

    /**
     * si quedan menos de 4
     * ignorar
     */
    if (rawCode.length !== 4) continue;

    /**
     * buscar cantidad al final
     */
    const cantidadMatch = linea.match(/(\d+)\s*$/);

    if (!cantidadMatch) continue;

    const cantidad = Number(cantidadMatch[1]);

    if (Number.isNaN(cantidad)) continue;

    /**
     * corrección contra catálogo
     */
    const codigo = correctCodeOcr(rawCode, validCodes);

    const actual = ventas.get(codigo) ?? 0;

    ventas.set(codigo, actual + cantidad);
  }

  return ventas;
}