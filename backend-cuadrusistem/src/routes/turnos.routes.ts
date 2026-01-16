import { Router, Request, Response } from 'express';
import db from '../db';
import chalk from 'chalk';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    console.log(chalk.blue('GET /api/turnos -> Fetching turnos from database.'));
    const { rows } = await db.query('SELECT * FROM "turnos" ORDER BY fecha DESC;');
    res.status(200).json(rows);
  } catch (error) {
    console.error(chalk.red('✗ Error fetching turnos from database:'), error);
    res.status(500).json({ message: 'Error fetching turnos.' });
  }
});

export default router;
