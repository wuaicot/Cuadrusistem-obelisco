import { Router, Request, Response } from 'express';
import db from '../db';
import chalk from 'chalk';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { tipo } = req.query; // tipo can be 'COCINA', 'CAJA', or undefined

  try {
    let query;
    const params = [];

    if (tipo && (String(tipo).toUpperCase() === 'COCINA' || String(tipo).toUpperCase() === 'CAJA')) {
      console.log(chalk.blue(`GET /api/ingredientes?tipo=${tipo} -> Fetching '${tipo}' ingredientes.`));
      query = 'SELECT id, "nombreVisible", tipo, unidad, created_at FROM "ingredientes" WHERE tipo = $1 ORDER BY "nombreVisible" ASC;';
      params.push(String(tipo).toUpperCase());
    } else {
      console.log(chalk.blue('GET /api/ingredientes -> Fetching all ingredientes.'));
      query = 'SELECT id, "nombreVisible", tipo, unidad, created_at FROM "ingredientes" ORDER BY "nombreVisible" ASC;';
    }
    
    // The frontend expects the column `nombreVisible`, so we will alias it here.
    const { rows } = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error(chalk.red('✗ Error fetching ingredientes from database:'), error);
    res.status(500).json({ message: 'Error fetching ingredientes.' });
  }
});

export default router;
