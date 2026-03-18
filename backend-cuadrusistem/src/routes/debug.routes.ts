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
      'Carne Hamburg Gigant.',
      'Carne Ave .Gigante', 
      'Papas grandes 700gr', 
      'Papas personal 350gr', 
      'Papas personal 150gr',
      'Chorizo', 
      'Menú 3 Carne Mechada', 
      'Menú 2 Pangasius', 
      'Menú 1 Pulpa/Chuleta',               
      'Hojarascas', 
      'Porciones de camarones', 
      'Champiñones', 
      'Porcion Pino Carne',
      'Porcion Pino Marisco',  
      'Jamón', 
      'Cheddar porc',     
      'Tocino porciones',
    ];

    // CAJA (Bebestibles y Delivery)
const ingredientesCaja = [
  'Ají en salsa 1 Kg',
  'Atún',
  'Agua mineral 1 1/2',
  'Aquarius y mineral 500cc',
  'Agua litro',
  'COCA COLA LATA',
  'Bebidas  1,5 litro',
  'Coca Cola 500cc.',
  'Jugo nectar 1 1/2 litros',
  'Jugo nectar individual',
  'Monster',
  'RedBull',
  'Barril Quilmes (tara 11,00)',
  'Barril Cristal (tara 9,54)',
  'Cerv Stella ret 1 Lt',
  'Cerv Escudo Ret 1 Lt',
  'Cerv Heineken ret 1 Lt',
  'Cerv Cristal ret 1 Lt',
  'Cerv Royal ret 1 Lt',
  'Cerveza Sol Ret 710cc',
  'Cerveza Bot Cristal 355cc',
  'Cerveza Bot Austral',
  'Cerveza Bot Escudo 355cc',
  'Cerveza Bot Heineken 355cc',
  'Cerveza Sol botellín',
  'Cerveza botella Royal 355cc',
  'Cerveza botella Kunstman',
  'Cerveza Botella Corona',
  'Cerveza lata Austral 1/2 lt',
  'Cerveza lata Cristal 1/2 lt',
  'Cerveza lata Escudo 1/2 lt',
  'Cerveza Heineken 1/2 lt',
  'Cerveza Royal 1/2 lt',
  'Cerveza Torobayo 1/2 lt',
  'Cerveza Escudo Silver 1/2',
  'Cerveza Coors 1/2 lt',
  'Cerveza lata pers Escudo',
  'Cerveza lata pers Cristal',
  'Cerveza Heineken lata pers.',
  'Cerveza Royal lata pers.',
  'Cerveza lata Lemon Stone',
  'Emp. Horno Pino Carne',
  'Emp. Horno marisco',  
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