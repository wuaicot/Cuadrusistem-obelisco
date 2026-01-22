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
      ('Aceite Lt', 'COCINA', 'unidades'),
      ('Aceitunas', 'COCINA', 'unidades'),
      ('Aji verde', 'COCINA', 'unidades'),
      ('Carne Ave Personal', 'COCINA', 'unidades'),
      ('Carne Ave .Gigante', 'COCINA', 'unidades'),
      ('Carne churrasco gig', 'COCINA', 'unidades'),
      ('Carne churrasco pers.', 'COCINA', 'unidades'),
      ('Carne Hamburg Gigant.', 'COCINA', 'unidades'),
      ('Carne hamburg. Porc.', 'COCINA', 'unidades'),
      ('Carne lomo gig.', 'COCINA', 'unidades'),
      ('Carne lomo pers.', 'COCINA', 'unidades'),
      ('Hamburg KING K', 'COCINA', 'unidades'),
      ('Carne para As Gig.', 'COCINA', 'unidades'),
      ('Champi;ones', 'COCINA', 'unidades'),
      ('Chorizo', 'COCINA', 'unidades'),
      ('Choclo', 'COCINA', 'unidades'),
      ('Lechuga', 'COCINA', 'unidades'),
      ('Cebolla cruda', 'COCINA', 'unidades'),
      ('Cebolla Cocida', 'COCINA', 'unidades'),
      ('Hojarascas', 'COCINA', 'unidades'),
      ('Huevos', 'COCINA', 'unidades'),
      ('Jamón', 'COCINA', 'unidades'),
      ('Chuleta', 'COCINA', 'unidades'),
      ('Pangasius', 'COCINA', 'unidades'),
      ('Carne Mechada', 'COCINA', 'unidades'),
      ('Tortilla De Wrap', 'COCINA', 'unidades'),
      ('Papas grandes 700gr', 'COCINA', 'unidades'),
      ('Papas personal 350gr', 'COCINA', 'unidades'),
      ('Papas personal 150gr', 'COCINA', 'unidades'),
      ('Porcion Pino Marisco', 'COCINA', 'unidades'),
      ('Porcion Pino Carne', 'COCINA', 'unidades'),
      ('Porciones de camarones', 'COCINA', 'unidades'),
      ('Crema', 'COCINA', 'unidades'),
      ('Palmitos', 'COCINA', 'unidades'),
      ('Paltas', 'COCINA', 'unidades'),
      ('Pan fricas', 'COCINA', 'unidades'),
      ('Pan hallullon', 'COCINA', 'unidades'),
      ('Pan Brioche 12', 'COCINA', 'unidades'),            
      ('Pan mesa Gigante', 'COCINA', 'unidades'),
      ('Pan mesa Personal', 'COCINA', 'unidades'),
      ('Pan mesa super Gigan.', 'COCINA', 'unidades'),
      ('Pepinillos', 'COCINA', 'unidades'),
      ('Porotos verdes Kg.', 'COCINA', 'unidades'),
      ('Queso laminado', 'COCINA', 'unidades'),
      ('Tocino porciones', 'COCINA', 'unidades'),
      ('Tomates Kg.', 'COCINA', 'unidades'),
      ('Vienesas doggi', 'COCINA', 'unidades'),
      ('Vienesas personal', 'COCINA', 'unidades'),
      ('Arroz', 'COCINA', 'unidades'),
      ('Cheddar porc', 'COCINA', 'unidades'),
      ('Aji en salsa 1 Kg', 'CAJA', 'unidades'),
      ('Atun', 'CAJA', 'unidades'),
      ('Agua mineral 1 1/2', 'CAJA', 'unidades'),
      ('Aquarius v mineral 500cc', 'CAJA', 'unidades'),
      ('Aqua litro', 'CAJA', 'unidades'),
      ('Bebida lata', 'CAJA', 'unidades'),
      ('Bebidas 1.5 litro', 'CAJA', 'unidades'),
      ('Coca Cola 500cc.', 'CAJA', 'unidades'),
      ('Jugo nectar 1 1/2clitros', 'CAJA', 'unidades'),
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
