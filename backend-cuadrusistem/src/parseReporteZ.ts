/**
 * Parser del Reporte Z (robusto para OCR térmico)
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

/**
 * Soporta cualquier forma de export de recetas.ts
 */
function getRecetasArray(): Receta[] {
  const mod: any = recetasModule;

  if (Array.isArray(mod.recetas)) return mod.recetas;
  if (Array.isArray(mod.RECETAS)) return mod.RECETAS;
  if (Array.isArray(mod.default)) return mod.default;

  throw new Error('No se encontró export de recetas válido');
}

const validCodes = getRecetasArray().map((r: Receta) => r.codigo);

const LINEA_PRODUCTO_REGEX = /^(\d{4})\s+(.+?)\s+(\d+)\s*$/;

export function parseReporteZ(textoZ: string): Map<string, number> {
  const ventas = new Map<string, number>();

  const lineas = textoZ
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  let zonaValida = false;

  for (const linea of lineas) {
    if (!zonaValida) {
      if (/^\d{4}\s+/.test(linea)) zonaValida = true;
      else continue;
    }

    const match = linea.match(LINEA_PRODUCTO_REGEX);
    if (!match) continue;

    const rawCode = match[1];
    const cantidad = Number(match[3]);
    if (Number.isNaN(cantidad)) continue;

    const codigo = correctCodeOcr(rawCode, validCodes);

    const actual = ventas.get(codigo) ?? 0;
    ventas.set(codigo, actual + cantidad);
  }

  return ventas;
}