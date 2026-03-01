import { createWorker } from 'tesseract.js';

/**
 * Crea y configura un worker de Tesseract para cada proceso de OCR.
 */
export async function getOcrWorker() {
  const worker = await createWorker('spa');

  await worker.setParameters({
    // @ts-ignore - Tesseract.js acepta números para PSM
    tessedit_pageseg_mode: 6, // Bloque uniforme: más flexible que el modo 4 para capturar TODAS las líneas.
    preserve_interword_spaces: '1',
  });

  return worker;
}

export async function runOcr(buffer: Buffer): Promise<any> {
  const w = await getOcrWorker();
  const result = await w.recognize(buffer);
  
  await w.terminate();
  
  return result.data.text;
}
