/**
 * Parser robusto del Reporte Z
 *
 * Diseñado para tickets POS térmicos donde el OCR
 * frecuentemente corrompe los códigos.
 */

import { matchProductHybrid, extractCantidadRobust } from './utils/pos-canonical'
import * as recetasModule from './domain/recetas'

export type VentaZ = {
  codigo: string
  cantidad: number
}

type Receta = {
  codigo: string;
  nombre: string;
}

function getRecetasArray(): Receta[] {
  const mod: any = recetasModule

  if (Array.isArray(mod.recetas)) return mod.recetas
  if (Array.isArray(mod.RECETAS)) return mod.RECETAS
  if (Array.isArray(mod.default)) return mod.default

  throw new Error('No se encontró export válido de recetas')
}

const catalog = getRecetasArray();

/**
 * Limpia ruido básico de OCR sin corromper nombres.
 */
function normalizeLine(line: string): string {
  return line
    .replace(/[|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export type ReporteZData = {
  ventas: Map<string, number>;
  fecha?: string;
  hora?: string;
};

export function parseReporteZ(textoZ: string): ReporteZData {
  const ventas = new Map<string, number>()
  let seccionActual = '' 
  let detectedFecha: string | undefined;
  let detectedHora: string | undefined;

  const lineas = textoZ
    .split('\n')
    .map(normalizeLine)
    .filter(line => line.length > 3)

  for (const linea of lineas) {
    const upper = linea.toUpperCase();

    // 0. EXTRACCIÓN DE METADATOS (Fecha y Hora)
    if (!detectedFecha) {
      const matchFecha = upper.match(/(\d{2})[-\/](\d{2})[-\/](\d{2,4})/);
      if (matchFecha) {
        let [_, dd, mm, yy] = matchFecha;
        if (yy.length === 2) yy = '20' + yy;
        detectedFecha = `${yy}-${mm}-${dd}`;
      }
    }
    if (!detectedHora) {
      const matchHora = upper.match(/(\d{2}):(\d{2})/);
      if (matchHora) {
        detectedHora = `${matchHora[1]}:${matchHora[2]}`;
      }
    }

    // 1. Identificar cambio de sección
    if (/[0-9OQ]\s*BAR/.test(upper) || (upper.includes('BAR') && (upper.includes('01') || upper.includes('O1')))) { 
      seccionActual = 'BAR'; continue; 
    }
    if (/[0-9OQ]\s*COCINA/.test(upper) || (upper.includes('COCINA') && (upper.includes('02') || upper.includes('O2')))) { 
      seccionActual = 'COCINA'; continue; 
    }
    if (/[0-9OQ]\s*EMPANADAS/.test(upper) || (upper.includes('EMPANADAS') && (upper.includes('03') || upper.includes('O3')))) { 
      seccionActual = 'EMPANADAS'; continue; 
    }

    // Saltar líneas de encabezado comunes
    if (
      upper.includes('TOTAL') ||
      upper.includes('VENTASPORARTICULO') ||
      upper.includes('CODIGO') ||
      upper.includes('LOCAL') ||
      upper.includes('FECHA') ||
      upper.includes('HORA') ||
      upper.includes('PAGINA') ||
      upper.includes('OBELISCO')
    ) continue

    // 2. Identificar Producto
    const codigo = matchProductHybrid(linea, catalog, seccionActual)
    if (!codigo) continue

    // 3. Extraer Cantidad
    let cantidad = extractCantidadRobust(linea, codigo)
    
    if (cantidad === null || cantidad <= 0) {
      cantidad = 1; // Asumir 1 si se detectó el producto pero la cantidad está borrosa
    }

    // 4. Consolidación
    const cleanCode = codigo.trim();
    const actual = ventas.get(cleanCode) ?? 0
    ventas.set(cleanCode, actual + cantidad)

    const prod = catalog.find(p => p.codigo === cleanCode)
    console.log(`[Parser] Match [${seccionActual}]: "${linea}" -> ${cleanCode} [${prod?.nombre || '?'}] (Cant: ${cantidad})`)
  }

  return { ventas, fecha: detectedFecha, hora: detectedHora };
}
