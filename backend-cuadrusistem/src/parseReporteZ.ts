import { recetas } from '../src/domain/recetas';

type Receta = {
  codigo: string;
};

const validCodes = recetas.map((r: Receta) => r.codigo);

function normalizeCode(raw: string): string {

  let code = raw
    .replace(/J/g, '3')
    .replace(/O/g, '0')
    .replace(/I/g, '1')
    .replace(/\D/g, '');

  if (code.length > 4) {
    code = code.substring(0, 4);
  }

  return code;
}

function normalizeQuantity(raw: string): number {

  const clean = raw
    .replace(/[YyJjIl]/g, '1')
    .replace(/O/g, '0')
    .replace(/\D/g, '');

  return Number(clean);
}

export function parseReporteZ(text: string): Map<string, number> {

  const ventas = new Map<string, number>();

  const lines = text
    .split('\n')
    .map((l: string) => l.trim())
    .filter(Boolean);

  for (const line of lines) {

    const codeMatch = line.match(/^[A-Z0-9]{3,6}/);
    if (!codeMatch) continue;

    const rawCode = normalizeCode(codeMatch[0]);

    if (rawCode.length !== 4) continue;

    const qtyMatch = line.match(/([A-Z0-9]+)$/);
    if (!qtyMatch) continue;

    const cantidad = normalizeQuantity(qtyMatch[1]);

    if (!cantidad) continue;

    const prev = ventas.get(rawCode) ?? 0;

    ventas.set(rawCode, prev + cantidad);
  }

  return ventas;
}




// /**
//  * Parser robusto del Reporte Z
//  *
//  * Diseñado para tickets POS térmicos donde el OCR
//  * frecuentemente corrompe los códigos.
//  */

// import { correctCodeOcr } from './utils/pos-canonical';
// import * as recetasModule from './domain/recetas';

// export type VentaZ = {
//   codigo: string;
//   cantidad: number;
// };

// type Receta = {
//   codigo: string;
// };

// function getRecetasArray(): Receta[] {
//   const mod: any = recetasModule;

//   if (Array.isArray(mod.recetas)) return mod.recetas;
//   if (Array.isArray(mod.RECETAS)) return mod.RECETAS;
//   if (Array.isArray(mod.default)) return mod.default;

//   throw new Error('No se encontró export válido de recetas');
// }

// const validCodes = getRecetasArray().map((r: Receta) => r.codigo);

// export function parseReporteZ(textoZ: string): Map<string, number> {

//   const ventas = new Map<string, number>();

//   const lineas = textoZ
//     .split('\n')
//     .map(l => l.trim())
//     .filter(Boolean);

//   for (const linea of lineas) {

//     /**
//      * Detectar números al inicio de línea
//      */
//     const codigoMatch = linea.match(/^[A-Z0-9]{3,6}/);

//     if (!codigoMatch) continue;

//     let rawCode = codigoMatch[0];

//     /**
//      * limpiar OCR basura
//      */
//     rawCode = rawCode
//       .replace(/J/g, '3')
//       .replace(/O/g, '0')
//       .replace(/I/g, '1')
//       .replace(/\D/g, '');

//     /**
//      * si hay más de 4 dígitos
//      * tomar los primeros
//      */
//     if (rawCode.length > 4) {
//       rawCode = rawCode.substring(0,4);
//     }

//     /**
//      * si quedan menos de 4
//      * ignorar
//      */
//     if (rawCode.length !== 4) continue;

//     /**
//      * buscar cantidad al final
//      */
//     const cantidadMatch = linea.match(/(\d+)\s*$/);

//     if (!cantidadMatch) continue;

//     const cantidad = Number(cantidadMatch[1]);

//     if (Number.isNaN(cantidad)) continue;

//     /**
//      * corrección contra catálogo
//      */
//     const codigo = correctCodeOcr(rawCode, validCodes);

//     const actual = ventas.get(codigo) ?? 0;

//     ventas.set(codigo, actual + cantidad);
//   }

//   return ventas;
// }