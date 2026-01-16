import { Router, Request, Response } from 'express';
import db from '../db';
import chalk from 'chalk';

const router = Router();

/**
 * @route   POST /api/debug/seed-database
 * @desc    (Development Only) Seeds the database with essential sample data.
 *          This route will DELETE existing data in the tables to avoid duplicates.
 * @access  Public (for development)
 */
router.post('/seed-database', async (req: Request, res: Response) => {
  console.log(chalk.yellow('⚠️  Received request to seed database with sample data.'));

  try {
    await db.query('BEGIN');
    console.log(chalk.magenta('-> Seeding transaction started.'));

    // Clear existing data to prevent duplicates
    console.log(chalk.gray('   - Deleting existing data...'));
    await db.query('DELETE FROM "planilla_items";');
    await db.query('DELETE FROM "planillas";');
    await db.query('DELETE FROM "ingredientes";');
    await db.query('DELETE FROM "turnos";');
    await db.query('DELETE FROM "locales";');
    await db.query('DELETE FROM "reporte_z";');      // Clean up related tables
    await db.query('DELETE FROM "users";');          // Clean up users table

    // Insert sample data
    console.log(chalk.gray('   - Inserting new sample data...'));

    // Users (needed for admin_id in reporte_z)
    await db.query(`
      INSERT INTO "users" (id, nombre) VALUES
      ('d3f8e9c0-8a4c-4a3d-9b6b-3e5e4a5d6f7d', 'Admin User');
    `);

    // Locales
    await db.query(`
      INSERT INTO "locales" (id, nombre) VALUES
      ('a1f5e9c0-8a4c-4a3d-9b6b-3e5e4a5d6f7b', 'Obelisco');
    `);

    // Turnos
    await db.query(`
      INSERT INTO "turnos" (id, tipo, fecha) VALUES
      ('b1f5e9c0-8a4c-4a3d-9b6b-3e5e4a5d6f7c', 'DIURNO', '2026-01-10');
    `);

    // Ingredientes
    await db.query(`
      INSERT INTO "ingredientes" ("nombreVisible", "tipo", "unidad") VALUES
      ('Vienesas personal', 'COCINA', 'unidades'),
      ('Pan de completo', 'COCINA', 'unidades'),
      ('Carne de hamburguesa', 'COCINA', 'unidades'),
      ('Coca-Cola 500ml', 'CAJA', 'unidades');
    `);

    await db.query('COMMIT');
    console.log(chalk.green('✓ Seeding transaction committed successfully.'));

    res.status(200).json({ message: 'Database seeded successfully with sample data.' });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error(chalk.red('✗ Error during database seeding, transaction rolled back.'), error);
    res.status(500).json({ message: 'Failed to seed database.' });
  }
});

export default router;
