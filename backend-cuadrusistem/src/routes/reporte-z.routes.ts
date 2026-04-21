import { Router, Request, Response } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import chalk from 'chalk';

import { runOcr } from '../ocr/ocrWorker';
import { preprocessTicket } from '../ocr/preprocess';
import { parseReporteZ } from '../parseReporteZ';
import db from '../db';

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
      console.log(chalk.green('✓ Pre-procesamiento finalizado.'));

      console.log(chalk.yellow('2. Ejecutando Tesseract OCR...'));
      const textoExtraido = await runOcr(processedBuffer);
      console.log(chalk.green('✓ OCR Finalizado.'));

      console.log(chalk.yellow('3. Parseando texto...'));
      const { ventas, fecha, hora } = parseReporteZ(textoExtraido);
      console.log(chalk.green(`✓ Parseo finalizado. ${ventas.size} items detectados.`));

      const ventasArray = Array.from(ventas.entries()).map(
        ([codigo, cantidad]) => ({ codigo, cantidad }),
      );

      // Inferencia de Turno sugerido basándose en la hora del ticket
      let suggestedTurno = '1er Turno';
      if (hora) {
        const [hh] = hora.split(':').map(Number);
        if (hh >= 18 || hh < 3) suggestedTurno = '2do Turno'; // 2do Turno es de 18:00 a 02:00
      }

      const checksum = crypto.createHash('md5').update(originalBuffer).digest('hex');
      const itemsJsonb = JSON.stringify(ventasArray);
      const archivoOriginal = req.file.originalname || '[PROCESADO EN MEMORIA]';

      console.log(chalk.yellow('4. Verificando duplicados (checksum)...'));
      const checkDup = await db.query('SELECT id FROM reportes_z WHERE checksum = $1', [checksum]);
      if (checkDup.rows.length > 0) {
        console.log(chalk.yellow(`! El archivo ya fue procesado anteriormente (ID: ${checkDup.rows[0].id})`));
        return res.status(409).json({ 
          message: 'Este archivo ya ha sido subido y procesado anteriormente.',
          reporteZId: checkDup.rows[0].id
        });
      }

      console.log(chalk.yellow('5. Guardando en base de datos...'));
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
        reporteZId: result.rows[0].id,
        detectedMetadata: {
          fecha,
          hora,
          suggestedTurno
        }
      });

    } catch (error: any) {
      console.error(chalk.red('Error detallado en POST /api/reporte-z:'), error);
      res.status(500).json({ 
        message: 'Internal Server Error', 
        error: error.message,
        detail: error.detail || null 
      });
    }
  },
);

export default router;
