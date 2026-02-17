import sharp from 'sharp';

export async function preprocessTicket(inputPath: string): Promise<string> {
  const outputPath = inputPath + '_processed.png';

  await sharp(inputPath)
    .grayscale()
    .normalize()
    .threshold(150)
    .toFile(outputPath);

  return outputPath;
}
// npm install sharp