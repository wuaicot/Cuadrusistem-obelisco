/**
 * Parser robusto del Reporte Z
 *
 * Diseñado para tickets POS térmicos donde el OCR
 * frecuentemente corrompe los códigos.
 */

import { correctCodeOcr } from './utils/pos-canonical'
import * as recetasModule from './domain/recetas'

export type VentaZ = {
  codigo: string
  cantidad: number
}

type Receta = {
  codigo: string
}

function getRecetasArray(): Receta[] {
  const mod: any = recetasModule

  if (Array.isArray(mod.recetas)) return mod.recetas
  if (Array.isArray(mod.RECETAS)) return mod.RECETAS
  if (Array.isArray(mod.default)) return mod.default

  throw new Error('No se encontró export válido de recetas')
}

const validCodes = getRecetasArray().map((r: Receta) => r.codigo)

/**
 * Limpia ruido típico de OCR
 */
function normalizeLine(line: string): string {
  return line
    .replace(/[|]/g, '')
    .replace(/O/g, '0')
    .replace(/I/g, '1')
    .replace(/J/g, '3')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Busca un posible código POS dentro de la línea
 */
function extractRawCode(line: string): string | null {

  /**
   * buscar secuencia de 4 dígitos
   * incluso si hay letras delante
   *
   * ejemplos:
   * N1896
   * P0785
   * 0382
   */

  const match = line.match(/(\d{4})/)

  if (!match) return null

  return match[1]
}

/**
 * Extrae cantidad como último número de la línea
 */
function extractCantidad(line: string): number | null {

  const nums = line.match(/\d+/g)

  if (!nums || nums.length === 0) return null

  const cantidad = Number(nums[nums.length - 1])

  if (Number.isNaN(cantidad)) return null

  return cantidad
}

export function parseReporteZ(textoZ: string): Map<string, number> {

  const ventas = new Map<string, number>()

  const lineas = textoZ
    .split('\n')
    .map(normalizeLine)
    .filter(Boolean)

  for (const linea of lineas) {

    /**
     * ignorar encabezados
     */
    if (
      linea.includes('TOTAL') ||
      linea.includes('VENTASPORARTICULO') ||
      linea.includes('CODIGO')
    ) continue

    const rawCode = extractRawCode(linea)

    if (!rawCode) continue

    const cantidad = extractCantidad(linea)

    if (!cantidad || cantidad <= 0 || cantidad > 50) continue

    /**
     * corrección contra catálogo POS
     */
    const codigo = correctCodeOcr(rawCode, validCodes)

    const actual = ventas.get(codigo) ?? 0

    ventas.set(codigo, actual + cantidad)
  }

  /**
   * Debug útil para desarrollo
   */
  console.log('--- Ventas Z ---')

  for (const [codigo, cantidad] of ventas.entries()) {
    console.log(`${codigo} → ${cantidad}`)
  }

  return ventas
}
