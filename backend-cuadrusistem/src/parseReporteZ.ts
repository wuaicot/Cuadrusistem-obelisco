/**
 * Parser del Reporte Z
 *
 * Objetivo:
 * - Leer el texto completo del Reporte Z (OCR o texto plano)
 * - Ignorar encabezados y basura visual
 * - Leer línea por línea, de izquierda a derecha
 * - Extraer SOLO:
 *    - código de producto
 *    - cantidad vendida
 *
 * Salida:
 *   Map<codigoProducto, cantidadVendida>
 */

export type VentaZ = {
  codigo: string;
  cantidad: number;
};

const LINEA_PRODUCTO_REGEX = /^(\d{4})\s+(.+?)\s+(\d+)$/;
// Ejemplo esperado:
// 0508 COM ITALIANO SUPER        3
// 4869 PROMO SCHOP 2X1           5

export function parseReporteZ(textoZ: string): Map<string, number> {
  const ventas = new Map<string, number>();

  const lineas = textoZ
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  let zonaValida = false;

  for (const linea of lineas) {
    /**
     * 1️⃣ Ignorar todo hasta que termine el encabezado
     * Regla: todo lo anterior a la primera línea con código es basura
     */
    if (!zonaValida) {
      if (/^\d{4}\s+/.test(linea)) {
        zonaValida = true;
      } else {
        continue;
      }
    }

    /**
     * 2️⃣ Parsear línea de producto
     */
    const match = linea.match(LINEA_PRODUCTO_REGEX);
    if (!match) continue;

    const codigo = match[1];
    const cantidad = Number(match[3]);

    if (Number.isNaN(cantidad)) continue;

    /**
     * 3️⃣ Acumular ventas por código
     * (el Z puede repetir códigos por secciones)
     */
    const actual = ventas.get(codigo) ?? 0;
    ventas.set(codigo, actual + cantidad);
  }

  return ventas;
}
