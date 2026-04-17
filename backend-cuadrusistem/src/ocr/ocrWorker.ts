import { createWorker, PSM } from 'tesseract.js';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

/**
 * Crea y configura un worker de Tesseract para cada proceso de OCR.
 * Intenta usar archivos locales de entrenamiento si están disponibles.
 */
export async function getOcrWorker() {
  const langPath = process.cwd(); // Donde está spa.traineddata en el contenedor
  const langFile = path.join(langPath, 'spa.traineddata');
  
  const hasLocalLang = fs.existsSync(langFile);
  console.log(chalk.cyan(`[OCR] Buscando datos de idioma en: ${langFile} -> ${hasLocalLang ? 'ENCONTRADO' : 'NO ENCONTRADO'}`));

  const worker = await createWorker('spa', 1, {
    langPath: hasLocalLang ? langPath : undefined,
    gzip: false,
    logger: m => {
      if (m.status === 'recognizing text') {
        if (Math.round(m.progress * 100) % 20 === 0) {
          console.log(chalk.gray(`[OCR Progress] ${Math.round(m.progress * 100)}%`));
        }
      }
    }
  });

  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
    preserve_interword_spaces: '1',
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+ /'
  });

  return worker;
}

export async function runOcr(buffer: Buffer): Promise<string> {
  let worker;
  try {
    console.log(chalk.cyan('[OCR] Iniciando worker...'));
    worker = await getOcrWorker();

    console.log(chalk.cyan('[OCR] Procesando buffer...'));
    const { data } = await worker.recognize(buffer);

    console.log(chalk.cyan('[OCR] Finalizado exitosamente.'));
    return data.text;
  } catch (err: any) {
    console.error(chalk.red('[OCR] Error crítico durante el proceso:'), err);
    throw new Error(`Error en Tesseract OCR: ${err.message}`);
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
}
