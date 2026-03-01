import sharp from 'sharp';

/**
 * Pre-procesa la imagen del reporte Z optimizado para tickets térmicos.
 */
export async function preprocessTicket(imageBuffer: Buffer): Promise<Buffer> {
  const image = sharp(imageBuffer);
  
  return await image
    .grayscale()
    .normalize()
    .median(3) // Elimina puntos de ruido "sal y pimienta" del papel térmico
    .linear(1.3, -0.1) // Un poco más de contraste pero controlado
    .resize({ width: 1400 }) // Tamaño equilibrado
    .toBuffer();
}
