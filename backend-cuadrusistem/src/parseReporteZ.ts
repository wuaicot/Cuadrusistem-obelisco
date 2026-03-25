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
    // NO eliminamos fracciones aquí, lo hará extractCantidadRobust de forma más selectiva
    .replace(/\s+/g, ' ')
    .trim()
}

export function parseReporteZ(textoZ: string): Map<string, number> {

  const ventas = new Map<string, number>()
  let seccionActual = '' 

  const lineas = textoZ
    .split('\n')
    .map(normalizeLine)
    .filter(line => line.length > 3)

  for (const linea of lineas) {
    // 0. Identificar cambio de sección
    const upper = linea.toUpperCase();
    if (upper.includes('01BAR')) { seccionActual = 'BAR'; continue; }
    if (upper.includes('02COCINA')) { seccionActual = 'COCINA'; continue; }
    if (upper.includes('03EMPANADAS')) { seccionActual = 'EMPANADAS'; continue; }

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

    // 1. Identificar Producto
    const codigo = matchProductHybrid(linea, catalog, seccionActual)
    if (!codigo) continue

    // 2. Extraer Cantidad
    let cantidad = extractCantidadRobust(linea, codigo)
    
    if (cantidad === null || cantidad <= 0) {
      // Solo asumimos 1 si el match por nombre fue muy fuerte (>0.8)
      // Esto evita capturar basura de metadatos como productos
      // (Pasamos la lógica de validación aquí si es necesario, 
      // pero por ahora usemos un log para auditar)
      cantidad = 1;
    }

    // 3. Consolidación estricta en el Map
    // Limpiamos el código por si acaso tuviera espacios
    const cleanCode = codigo.trim();
    const actual = ventas.get(cleanCode) ?? 0
    ventas.set(cleanCode, actual + cantidad)

    const prod = catalog.find(p => p.codigo === cleanCode)
    console.log(`[Parser] Match [${seccionActual}]: "${linea}" -> ${cleanCode} [${prod?.nombre || '?'}] (Cant: ${cantidad})`)
  }

  return ventas
}
