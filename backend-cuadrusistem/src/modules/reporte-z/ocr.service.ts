// backend-cuadrusistem/src/modules/reporte-z/ocr.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createWorker, Worker } from 'tesseract.js';

@Injectable()
export class OcrService implements OnModuleInit, OnModuleDestroy {
  private worker: Worker | null = null;

  async onModuleInit() {
    this.worker = await createWorker('spa'); // 'spa' for Spanish language
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.terminate();
    }
  }

  async processImage(imageBuffer: Buffer): Promise<string> {
    if (!this.worker) {
      throw new Error('Tesseract worker not initialized.');
    }
    const { data: { text } } = await this.worker.recognize(imageBuffer);
    return text;
  }
}
