import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { createWorker } from 'tesseract.js';
import { parseReporteZ } from '../../parseReporteZ';

const router = Router();

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../../../uploads/reportes-z');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

/**
 * @route   GET /api/reporte-z
 * @desc    Get a list of all Reporte Z files (processed or unprocessed)
 * @access  Public (for now)
 */
router.get('/', (req: Request, res: Response) => {
  console.log(chalk.blue('GET /api/reporte-z -> Fetching Reporte Z files.'));

  try {
    const files = fs.readdirSync(uploadDir);
    const reporteZFiles = files.map(filename => ({
      filename: filename,
      path: `/uploads/reportes-z/${filename}`, // Frontend can use this path to display/download
      processed: false, // Placeholder: assume unprocessed for now
      // Add more metadata if available from DB later
    }));

    // Optionally filter by 'procesado=false' query parameter, but for now, return all
    // const filterProcessed = req.query.procesado === 'false';
    // let filteredFiles = reporteZFiles;
    // if (filterProcessed) {
    //   filteredFiles = reporteZFiles.filter(file => !file.processed);
    // }

    console.log(chalk.green(`✓ Found ${reporteZFiles.length} Reporte Z files.`));
    res.status(200).json(reporteZFiles);
  } catch (error) {
    console.error(chalk.red('✗ Error fetching Reporte Z files:'), error);
    res.status(500).json({ message: 'Error fetching Reporte Z files.' });
  }
});

/**
 * @route   POST /api/reporte-z
 * @desc    Upload and process a Reporte Z image file
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

  try {
    console.log(chalk.yellow('Recognizing text from image...'));
    const ret = await worker.recognize(req.file.path);
    const textoExtraido = ret.data.text;
    console.log(chalk.green('✓ Text recognized successfully.'));
    console.log(chalk.gray('--- OCR Text Start ---\n'), textoExtraido, chalk.gray('\n--- OCR Text End ---'));

    console.log(chalk.yellow('Parsing recognized text...'));
    const ventasMap = parseReporteZ(textoExtraido);
    
    // Convert Map to an array of objects for JSON response
    const ventasArray = Array.from(ventasMap.entries()).map(([codigo, cantidad]) => ({ codigo, cantidad }));

    console.log(chalk.green('✓ Text parsed successfully.'));
    console.dir(ventasArray);

    res.status(200).json({
      message: 'Reporte Z processed successfully.',
      data: {
        rawText: textoExtraido,
        ventas: ventasArray,
      }
    });
  } catch (error) {
    console.error(chalk.red('✗ An error occurred during OCR processing:'), error);
    res.status(500).json({ message: 'Failed to process image.' });
  } finally {
    // Ensure worker is always terminated
    await worker.terminate();
    console.log(chalk.magenta('Tesseract worker terminated.'));
  }
});

export default router;
