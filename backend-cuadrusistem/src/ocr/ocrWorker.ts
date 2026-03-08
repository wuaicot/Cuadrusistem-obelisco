import { createWorker, PSM } from 'tesseract.js';

/**
 * Crea y configura un worker de Tesseract para cada proceso de OCR.
 */

export async function getOcrWorker() {
  const worker = await createWorker('spa');

  await worker.setParameters({
    // modo de segmentación más flexible para tickets / POS
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,

    // preservar espacios detectados
    preserve_interword_spaces: '1',

    // limitar caracteres permitidos (reduce ruido del OCR)
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  });

  return worker;
}

export async function runOcr(buffer: Buffer): Promise<string> {
  const worker = await getOcrWorker();

  const { data } = await worker.recognize(buffer);

  await worker.terminate();

  return data.text;
}