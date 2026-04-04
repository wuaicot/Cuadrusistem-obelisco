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
    .normalize() // Ajusta el contraste dinámicamente
    .linear(1.2, -0.1) // Un poco de contraste manual pero más suave
    .sharpen()
    .threshold(165) // Umbral un poco más bajo para no deformar caracteres delgados como '1'
    .extend({
      top: 60,
      bottom: 60,
      left: 60,
      right: 60,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .toBuffer();
}
