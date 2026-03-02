// backend-cuadrusistem/src/routes/debug.routes.ts
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
    await db.query('DELETE FROM "reporte_z";');
    await db.query('DELETE FROM "users";');

    // Insert sample data
    console.log(chalk.gray('   - Inserting new sample data...'));

    // Users
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
      ('b1f5e9c0-8a4c-4a3d-9b6b-3e5e4a5d6f7c', 'DIURNO', CURRENT_DATE);
    `);

    // Ingredientes generados desde recetas.ts
    // COCINA (Ingredientes de Menús y Empanadas)
    const ingredientesCocina = [
      'Pan mesa Personal', 
      'Vienesas personal', 
      'Huevos', 
      'Pan mesa Gigante',      
      'Vienesas doggi', 
      'Pan mesa súper Gigan.', 
      'Carne para As Gig.', 
      'Pan hallullon', 
      'Carne churrasco gig', 
      'Carne churrasco pers.', 
      'Paltas', 
      'Pan fricas', 
      'Carne lomo gig.', 
      'Carne lomo pers.', 
      'Carne Ave Personal', 
      'Pan Brioche 12', 
      'Carne hamburg. Porc.', 
      'Queso laminado', 
      'Hamburg KING K', 
      'Carne Ave .Gigante', 
      'Papas grandes 700gr', 
      'Papas personal 350gr', 
      'Chorizo', 
      'Carne Mechada', 
      'Pangasiu', 
      'Colacion Administrad', 
      'Chuleta', 
      'Papas personal 150gr', 
      'Tortilla De Wrap', 
      'Emp. Horno Pino Carne', 
      'Emp. Horno marisco', 
      'Hojarascas', 
      'Porciones de camarones', 
      'Champiñones', 
      'Porcion Pino Carne'
    ];

    // CAJA (Bebestibles y Delivery)
    const ingredientesCaja = [
      'AUSTRAL LATA 1/2', 
      'ESCUDO LITRO', 
      'ROYAL LITRO', 
      'BOTELLIN CRISTAL', 
      'BOTELLIN TOROBAYO', 
      'HEINEKEN LATA',     
      'JUGO NATURAL',  
      'ESCUDO LATA 1/2', 
      'CRISTAL LATA 1/2', 
      'CRISTAL LITRO',
      'SCHOP QUILMES 500CC', 
      'SCHOP CISTAL 500CC',
      'BOTELLIN HEINEKEN', 
      'CERVEZA SOL BOTELLIN', 
      'SHOP CRISTAL 500CC', 
      'HEINEKEN LATA 1/2', 
      'BOTELLIN ROYAL', 
      'ROYAL LATA 1/2', 
      'STELLA LITRO 1LT', 
      'PITCHER QUILMES 1.5', 
      'CORONA BOTELLIN', 
      'COCA COLA LATA', 
      'MONSTER BEBIDA ENERG', 
      'COCA COLA 591CC', 
      'VITAL SIN GAS', 
      'VITAL 1 1/2', 
      'BBIDA 1 1/5', 
      'NECTAR IND', 
      'NECTAR 1 1/2',
      'CAFE GRANDE', 
      'TE GRANDE', 
      'PROMO SCHOP 2X1',
      'DELIVERY      APP'
    ];

    console.log(chalk.gray(`   - Inserting ${ingredientesCocina.length} items for COCINA...`));
    for (const nom of ingredientesCocina) {
      await db.query('INSERT INTO "ingredientes" ("nombreVisible", "tipo", "unidad") VALUES ($1, $2, $3)', [nom, 'COCINA', 'unidades']);
    }

    console.log(chalk.gray(`   - Inserting ${ingredientesCaja.length} items for CAJA...`));
    for (const nom of ingredientesCaja) {
      await db.query('INSERT INTO "ingredientes" ("nombreVisible", "tipo", "unidad") VALUES ($1, $2, $3)', [nom, 'CAJA', 'unidades']);
    }

    await db.query('COMMIT');
    console.log(chalk.green('✓ Seeding transaction committed successfully.'));

    res.status(200).json({ message: 'Database seeded successfully with synchronized data.' });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error(chalk.red('✗ Error during database seeding, transaction rolled back.'), error);
    res.status(500).json({ message: 'Failed to seed database.' });
  }
});

export default router;

// Invoke-WebRequest -Uri http://localhost:3000/api/debug/seed-database -Method POST