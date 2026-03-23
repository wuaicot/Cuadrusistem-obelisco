import sharp from 'sharp';

/**
 * Pre-procesa la imagen del reporte Z optimizado para tickets térmicos.
 * Añade márgenes y mejora la nitidez para evitar cortes en las cantidades.
 */
export async function preprocessTicket(imageBuffer: Buffer): Promise<Buffer> {
  const image = sharp(imageBuffer);
  
  return await image
    .resize({ width: 1600, withoutEnlargement: false }) // Un poco más grande para mayor detalle
    .grayscale()
    .normalize()
    .sharpen({
      sigma: 1.5,
      m1: 0.5,
      m2: 1.0
    }) // Mejora agresiva de bordes para texto pequeño
    .extend({
      top: 40,
      bottom: 40,
      left: 40,
      right: 40,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }) // Añade margen blanco para que Tesseract no pierda bordes
    .toBuffer();
}
