import { createWorker, Worker } from 'tesseract.js';

let workerPromise: Promise<Worker> | null = null;

export async function getOCRWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = (async () => {
      const worker = await createWorker('spa');

      await worker.setParameters({
        tessedit_pageseg_mode: '6',
        preserve_interword_spaces: '1',
        tessedit_char_whitelist:
          '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,-',
      });

      return worker;
    })();
  }

  return workerPromise;
}

// npm install tesseract.js
