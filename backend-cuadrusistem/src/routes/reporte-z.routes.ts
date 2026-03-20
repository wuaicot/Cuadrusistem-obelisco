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

const router = Router();

/* =========================
   MULTER CONFIG
========================= */
const uploadDir = path.join(__dirname, '../../public/uploads/reportes-z');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + unique + path.extname(file.originalname));
  }
});

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
    console.log(chalk.blue('POST /api/reporte-z'));

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { fechaOperacion, localId, turnoId } = req.body;
    if (!fechaOperacion || !localId || !turnoId) {
       return res.status(400).json({ message: 'Missing required fields: fechaOperacion, localId, or turnoId.' });
    }

    console.log(chalk.green('File uploaded:'), req.file.filename);

    try {
      /* =========================
         OCR
      ========================= */
      console.log(chalk.yellow('Preprocessing image...'));
      const originalBuffer = fs.readFileSync(req.file.path);
      const processedBuffer = await preprocessTicket(originalBuffer);

      console.log(chalk.yellow('Running OCR...'));
      const textoExtraido = await runOcr(processedBuffer);

      console.log(chalk.green('OCR OK'));
      console.log(chalk.gray('--- Texto OCR Bruto ---'));
      console.log(textoExtraido || '(Texto vacío)');
      console.log(chalk.gray('-----------------------'));

      /* =========================
         PARSE
      ========================= */
      console.log(chalk.yellow('Parsing OCR text...'));

      const ventasMap = parseReporteZ(textoExtraido);

      const ventasArray = Array.from(ventasMap.entries()).map(
        ([codigo, cantidad]) => ({ codigo, cantidad })
      );

      console.log(chalk.cyan('--- Ventas Z ---'));
      ventasArray.forEach(v =>
        console.log(chalk.cyan(`${v.codigo} → ${v.cantidad}`))
      );

      /* =========================
         CHECKSUM
      ========================= */
      const buffer = fs.readFileSync(req.file.path);
      const checksum = crypto.createHash('md5').update(buffer).digest('hex');

      /* =========================
         INSERT
      ========================= */
      const archivoOriginal = req.file.path;
      const itemsJsonb = JSON.stringify(ventasArray);

      const insertQuery = `
        INSERT INTO "reportes_z" (
          "archivo_original", "checksum", "items", "fecha_operacion",
          "local_id", "turno_id", "procesado"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
      `;

      const result = await db.query(insertQuery, [
        archivoOriginal,
        checksum,
        itemsJsonb,
        fechaOperacion,
        localId,
        turnoId,
        false
      ]);

      const id = result.rows[0].id;

      res.status(201).json({
        message: `Reporte Z procesado y guardado exitosamente con ID: ${id}.`,
        reporteZId: id
      });

    } catch (error: any) {
      if (
        error.code === '23505' &&
        error.constraint === 'reportes_z_checksum_key'
      ) {
        return res
          .status(409)
          .json({ message: 'Este archivo ya fue cargado.' });
      }

      console.error(chalk.red('Reporte Z error'), error);
      res.status(500).json({ message: 'Failed to process Reporte Z' });
    }
  }
);

export default router;