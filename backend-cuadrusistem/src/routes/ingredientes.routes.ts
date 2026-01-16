import { Router, Request, Response } from 'express';
import db from '../db';
import chalk from 'chalk';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    console.log(chalk.blue('GET /api/ingredientes -> Fetching ingredientes from database.'));
    // The frontend expects the column `nombreVisible`, so we will alias it here.
    const { rows } = await db.query('SELECT id, "nombreVisible", tipo, unidad, created_at FROM "ingredientes" ORDER BY "nombreVisible" ASC;');
    res.status(200).json(rows);
  } catch (error) {
    console.error(chalk.red('✗ Error fetching ingredientes from database:'), error);
    res.status(500).json({ message: 'Error fetching ingredientes.' });
  }
});

export default router;
