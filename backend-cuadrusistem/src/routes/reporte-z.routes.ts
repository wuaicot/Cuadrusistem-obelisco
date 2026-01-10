import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { createWorker } from 'tesseract.js';
import { parseReporteZ } from '../parseReporteZ';
import db from '../db'; // Importar la configuración de la base de datos

const router = Router();

// (El código de configuración de multer y directorio no cambia)
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
router.get('/', (req: Request, res: Response) => {
  // ... (lógica existente)
});


/**
 * @route   POST /api/reporte-z
 * @desc    Upload, process, and save a Reporte Z image file
 * @access  Public (for now)
 */
router.post('/', upload.single('reporteZFile'), async (req: Request, res: Response) => {
  console.log(chalk.blue('POST /api/reporte-z -> Received file for processing.'));

  if (!req.file) {
    console.log(chalk.red('✗ Error: No file uploaded.'));
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  console.log(chalk.green('✓ File uploaded successfully:'), { filename: req.file.filename });
  
  const worker = await createWorker('spa');
  let newReporteZId: string | null = null;

  try {
    // Iniciar transacción
    await db.query('BEGIN');
    console.log(chalk.magenta('-> Transacción de Reporte Z iniciada.'));

    // 1. Insertar registro inicial en 'reportes_z'
    const reporteInsertQuery = `INSERT INTO "reportes_z" (file_path) VALUES ($1) RETURNING id;`;
    const reporteResult = await db.query(reporteInsertQuery, [req.file.path]);
    newReporteZId = reporteResult.rows[0].id;
    console.log(chalk.cyan(`   - Creado reporte_z con ID: ${newReporteZId}`));

    // 2. Procesar la imagen con OCR
    console.log(chalk.yellow('Recognizing text from image...'));
    const ret = await worker.recognize(req.file.path);
    const textoExtraido = ret.data.text;
    console.log(chalk.green('✓ Text recognized successfully.'));

    // 3. Actualizar el registro con el texto extraído y la fecha de procesamiento
    const reporteUpdateQuery = `UPDATE "reportes_z" SET raw_text = $1, processed_at = NOW() WHERE id = $2;`;
    await db.query(reporteUpdateQuery, [textoExtraido, newReporteZId]);
    console.log(chalk.cyan(`   - Actualizado reporte_z ${newReporteZId} con texto OCR.`));

    // 4. Parsear el texto y guardar las ventas
    console.log(chalk.yellow('Parsing recognized text...'));
    const ventasMap = parseReporteZ(textoExtraido);
    const ventasArray = Array.from(ventasMap.entries()).map(([codigo, cantidad]) => ({ codigo, cantidad }));
    
    if (ventasArray.length > 0) {
      console.log(chalk.cyan(`   - Insertando ${ventasArray.length} items de venta...`));
      for (const venta of ventasArray) {
        const ventaInsertQuery = `
          INSERT INTO "reporte_z_ventas" (reporte_z_id, codigo_producto, cantidad)
          VALUES ($1, $2, $3);
        `;
        await db.query(ventaInsertQuery, [newReporteZId, venta.codigo, venta.cantidad]);
      }
      console.log(chalk.cyan(`   - Items de venta insertados.`));
    }
    console.log(chalk.green('✓ Text parsed successfully.'));

    // 5. Finalizar la transacción
    await db.query('COMMIT');
    console.log(chalk.green('✓ Transacción de Reporte Z completada (COMMIT).'));

    res.status(200).json({
      message: 'Reporte Z procesado y guardado exitosamente.',
      reporteZId: newReporteZId,
      data: {
        rawText: textoExtraido,
        ventas: ventasArray,
      }
    });

  } catch (error) {
    // Si hay un error, revertir la transacción
    await db.query('ROLLBACK');
    console.error(chalk.red('✗ An error occurred during Reporte Z transaction, ROLLBACK ejecutado.'), error);
    res.status(500).json({ message: 'Failed to process and save image.' });

  } finally {
    // Asegurarse de que el worker de Tesseract siempre se cierre
    await worker.terminate();
    console.log(chalk.magenta('Tesseract worker terminated.'));
  }
});

export default router;
