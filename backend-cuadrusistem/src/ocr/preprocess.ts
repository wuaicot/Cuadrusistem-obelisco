import sharp from 'sharp';

/**
 * Pre-procesa la imagen del reporte Z optimizado para tickets térmicos.
 * Añade márgenes y mejora la nitidez para evitar cortes en las cantidades.
 */
export async function preprocessTicket(imageBuffer: Buffer): Promise<Buffer> {
  const image = sharp(imageBuffer);
  
  return await image
    .resize({ width: 2200, withoutEnlargement: false }) 
    .grayscale()
    .linear(1.5, -0.2) // Aumenta el contraste: multiplica por 1.5 y resta brillo
    .sharpen({ sigma: 1.5, m1: 2, m2: 20 }) // Realce agresivo de bordes de letras
    .threshold(175) // Umbral ligeramente más alto para capturar tintas tenues
    .extend({
      top: 60,
      bottom: 60,
      left: 60,
      right: 200,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .toBuffer();
}
