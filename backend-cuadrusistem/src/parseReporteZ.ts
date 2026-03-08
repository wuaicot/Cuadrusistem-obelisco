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