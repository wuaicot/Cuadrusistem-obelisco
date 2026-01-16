import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto'; // Import crypto for checksum
import chalk from 'chalk';
import { createWorker } from 'tesseract.js';
import { parseReporteZ } from '../parseReporteZ';
import db from '../db';

const router = Router();

// Multer config remains the same
const uploadDir = path.join(__dirname, '../../public/uploads/reportes-z');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir); },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// (La ruta GET no cambia por ahora)
router.get('/', async (req: Request, res: Response) => {
  console.log(chalk.blue('GET /api/reporte-z -> Fetching Reporte Z records from database.'));

  try {
    const queryParams: any[] = [];
    let queryText = `
      SELECT r.id, r."fechaOperacion", r."archivoOriginal", r.checksum, r.procesado,
             l.nombre as local_nombre,
             t.tipo as turno_tipo
      FROM "reporte_z" r
      LEFT JOIN "locales" l ON r.local_id = l.id
      LEFT JOIN "turnos" t ON r.turno_id = t.id
    `;

    if (req.query.procesado === 'false') {
      queryText += ` WHERE r.procesado = FALSE`;
    }
    
    queryText += ` ORDER BY r."fechaOperacion" DESC, r."created_at" DESC;`;

    const { rows } = await db.query(queryText, queryParams);
    
    console.log(chalk.green(`✓ Found ${rows.length} Reporte Z records.`));
    res.status(200).json(rows);
  } catch (error) {
    console.error(chalk.red('✗ Error fetching Reporte Z records from database:'), error);
    res.status(500).json({ message: 'Error fetching Reporte Z records.' });
  }
});


/**
 * @route   POST /api/reporte-z
 * @desc    Upload, process, and save a Reporte Z image file
 * @access  Public (for now)
 */
router.post('/', upload.single('reporteZFile'), async (req: Request, res: Response) => {
  console.log(chalk.blue('POST /api/reporte-z -> Received file for processing.'));

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  console.log(chalk.green('✓ File uploaded successfully:'), { filename: req.file.filename });
  
  const worker = await createWorker('spa');

  try {
    // --- This entire block is new logic ---

    // 1. Process OCR to get the text
    console.log(chalk.yellow('Recognizing text from image...'));
    const { data: { text: textoExtraido } } = await worker.recognize(req.file.path);
    console.log(chalk.green('✓ Text recognized successfully.'));

    // 2. Parse the text to get sales items
    console.log(chalk.yellow('Parsing recognized text...'));
    const ventasMap = parseReporteZ(textoExtraido);
    const ventasArray = Array.from(ventasMap.entries()).map(([codigo, cantidad]) => ({ codigo, cantidad }));
    console.log(chalk.green('✓ Text parsed successfully.'));

    // 3. Generate a checksum for the file to prevent duplicates
    console.log(chalk.yellow('Generating file checksum...'));
    const fileBuffer = fs.readFileSync(req.file.path);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    const checksum = hashSum.digest('hex');
    console.log(chalk.green(`✓ Checksum generated: ${checksum}`));

    // 4. Prepare data for INSERT.
    // WARNING: local_id, turno_id, admin_id, and fechaOperacion are hardcoded
    // because they are not yet sent from the frontend. This is a temporary measure.
    const archivoOriginal = req.file.path;
    const itemsJsonb = JSON.stringify(ventasArray);
    const fechaOperacion = new Date(); // Placeholder
    const local_id = 'a1f5e9c0-8a4c-4a3d-9b6b-3e5e4a5d6f7b'; // Hardcoded from seed
    const turno_id = 'b1f5e9c0-8a4c-4a3d-9b6b-3e5e4a5d6f7c'; // Hardcoded from seed
    const admin_id = 'd3f8e9c0-8a4c-4a3d-9b6b-3e5e4a5d6f7d'; // Hardcoded to match seeded admin user
    const procesado = false;

    // 5. Execute the single INSERT statement
    console.log(chalk.yellow('Inserting Reporte Z into database...'));
    const insertQuery = `
      INSERT INTO "reporte_z" (
        "archivoOriginal", "checksum", "items", "fechaOperacion", 
        "local_id", "turno_id", "admin_id", "procesado"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;
    const result = await db.query(insertQuery, [
      archivoOriginal, checksum, itemsJsonb, fechaOperacion,
      local_id, turno_id, admin_id, procesado
    ]);
    const newReporteZId = result.rows[0].id;
    console.log(chalk.green(`✓ Successfully inserted Reporte Z with ID: ${newReporteZId}`));

    res.status(201).json({
      message: 'Reporte Z procesado y guardado exitosamente.',
      reporteZId: newReporteZId,
      data: {
        rawText: textoExtraido,
        ventas: ventasArray,
      }
    });

  } catch (error: any) {
    // Check for unique constraint violation on checksum
    if (error.code === '23505' && error.constraint === 'reporte_z_checksum_key') {
      console.warn(chalk.yellow('⚠️  Attempted to upload a duplicate Reporte Z file.'));
      return res.status(409).json({ message: 'Este archivo de Reporte Z ya ha sido subido.' });
    }
    
    console.error(chalk.red('✗ An error occurred during Reporte Z processing:'), error);
    res.status(500).json({ message: 'Failed to process and save image.' });

  } finally {
    // Ensure worker is always terminated
    await worker.terminate();
    console.log(chalk.magenta('Tesseract worker terminated.'));
  }
});

export default router;