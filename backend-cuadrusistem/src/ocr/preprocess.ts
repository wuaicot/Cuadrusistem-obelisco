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
    .normalize()
    .sharpen()
    .threshold(165)
    .extend({
      top: 60,
      bottom: 60,
      left: 60,
      right: 200,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .toBuffer();
}
