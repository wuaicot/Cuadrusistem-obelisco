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

  const lineas = textoZ
    .split('\n')
    .map(normalizeLine)
    .filter(line => line.length > 4) // Ignorar líneas muy cortas

  for (const linea of lineas) {

    /**
     * ignorar encabezados y totales
     */
    if (
      linea.includes('TOTAL') ||
      linea.includes('VENTASPORARTICULO') ||
      linea.includes('CODIGO') ||
      linea.includes('LOCAL') ||
      linea.includes('FECHA')
    ) continue

    // 1. Identificar Producto (Híbrido)
    const codigo = matchProductHybrid(linea, catalog)
    if (!codigo) continue

    // 2. Extraer Cantidad (Robust) - Pasamos el código para ignorar sus números
    const cantidad = extractCantidadRobust(linea, codigo)
    
    // Si no hay cantidad, intentamos un valor por defecto solo si la línea es muy clara
    // Pero para evitar errores, mejor ignorar si no hay cantidad numérica detectable.
    if (cantidad === null || cantidad <= 0 || cantidad > 100) {
      console.log(`[Parser] Ítem identificado (${codigo}) pero sin cantidad válida en: "${linea}"`)
      continue
    }

    const actual = ventas.get(codigo) ?? 0
    ventas.set(codigo, actual + cantidad)

    // Log detallado para depuración
    const prod = catalog.find(p => p.codigo === codigo)
    console.log(`[Parser] Match: "${linea}" -> ${codigo} [${prod?.nombre || '?'}] (Cant: ${cantidad})`)
  }

  return ventas
}
