import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import chalk from 'chalk';

import { runOcr } from '../ocr/ocrWorker';
import { preprocessTicket } from '../ocr/preprocess';
import { parseReporteZ } from '../parseReporteZ';
import db from '../db';
import { recetas as catalog } from '../domain/recetas';

const router = Router();

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* =========================
   GET /api/reporte-z
========================= */
router.get('/', async (req: Request, res: Response) => {
  console.log(chalk.blue('GET /api/reporte-z'));

  try {
    let query = `
      SELECT r.id, r.fecha_operacion AS "fechaOperacion", r.archivo_original AS "archivoOriginal", r.checksum, r.procesado,
             l.nombre as local_nombre,
             t.tipo as turno_tipo
      FROM "reportes_z" r
      LEFT JOIN "locales" l ON r.local_id = l.id
      LEFT JOIN "turnos" t ON r.turno_id = t.id
    `;

    if (req.query.procesado === 'false') {
      query += ` WHERE r.procesado = FALSE`;
    }

    query += ` ORDER BY r.fecha_operacion DESC, r.created_at DESC;`;

    const { rows } = await db.query(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error(chalk.red('Error fetching Reporte Z'), err);
    res.status(500).json({ message: 'Error fetching Reporte Z' });
  }
});

/* =========================
   POST /api/reporte-z
========================= */
router.post(
  '/',
  upload.single('reporteZFile'),
  async (req: Request, res: Response) => {
    console.log(chalk.bgBlue.white(' POST /api/reporte-z '));

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { fechaOperacion, localId, turnoId } = req.body;
    if (!fechaOperacion || !localId || !turnoId) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
      console.log(chalk.yellow('1. Pre-procesando imagen...'));
      const originalBuffer = req.file.buffer;
      const processedBuffer = await preprocessTicket(originalBuffer);

      console.log(chalk.yellow('2. Ejecutando Tesseract OCR...'));
      const textoExtraido = await runOcr(processedBuffer);

      console.log(chalk.green('✓ OCR Finalizado.'));
      console.log(chalk.magenta('\n=== TEXTO BRUTO DEL OCR (INICIO) ==='));
      console.log(textoExtraido);
      console.log(chalk.magenta('=== TEXTO BRUTO DEL OCR (FIN) ===\n'));

      console.log(chalk.yellow('3. Parseando texto...'));
      const ventasMap = parseReporteZ(textoExtraido);

      const ventasArray = Array.from(ventasMap.entries()).map(
        ([codigo, cantidad]) => ({ codigo, cantidad }),
      );

      const checksum = crypto.createHash('md5').update(originalBuffer).digest('hex');
      const itemsJsonb = JSON.stringify(ventasArray);
      const archivoOriginal = '[PROCESADO EN MEMORIA]';

      const insertQuery = `
        INSERT INTO "reportes_z" (
          "archivo_original", "checksum", "items", "fecha_operacion",
          "local_id", "turno_id", "procesado"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
      `;

      const result = await db.query(insertQuery, [
        archivoOriginal, checksum, itemsJsonb, fechaOperacion, localId, turnoId, false
      ]);

      console.log(chalk.green(`✓ Reporte Z ID: ${result.rows[0].id} guardado.`));

      res.status(201).json({
        message: 'Reporte Z procesado.',
        reporteZId: result.rows[0].id
      });

    } catch (error: any) {
      console.error(chalk.red('Error en POST /api/reporte-z:'), error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
);

export default router;
