import { Router, Request, Response } from 'express';
import db from '../db';
import chalk from 'chalk';

const router = Router();

/**
 * POST /api/debug/seed-database
 * @desc    (Development Only) Seeds the database with the exact ordered lists for Obelisco.
 *          Sincroniza ingredientes, locales y turnos con el orden real de las planillas.
 * @access  Public (for development)
 */
router.post('/seed-database', async (req: Request, res: Response) => {
  console.log(chalk.yellow('⚠️  Received request to seed database with EXACT ORDER data.'));

  try {
    await db.query('BEGIN');
    console.log(chalk.magenta('-> Seeding transaction started.'));

    // 1. Limpieza profunda
    console.log(chalk.gray('   - Deleting existing data...'));
    await db.query('DELETE FROM "planilla_items" CASCADE;');
    await db.query('DELETE FROM "planillas" CASCADE;');
    await db.query('DELETE FROM "reportes_z" CASCADE;');
    await db.query('DELETE FROM "ingredientes" CASCADE;');
    await db.query('DELETE FROM "turnos" CASCADE;');
    await db.query('DELETE FROM "locales" CASCADE;');
    await db.query('DELETE FROM "users" CASCADE;');

    // 2. Insertar Entidades Base
    console.log(chalk.gray('   - Inserting base entities...'));
    await db.query(`INSERT INTO "users" (id, nombre) VALUES ('d3f8e9c0-8a4c-4a3d-9b6b-3e5e4a5d6f7d', 'Admin User');`);
    await db.query(`INSERT INTO "locales" (id, nombre) VALUES ('a1f5e9c0-8a4c-4a3d-9b6b-3e5e4a5d6f7b', 'Obelisco');`);
    await db.query(`INSERT INTO "turnos" (id, tipo, fecha) VALUES ('b1f5e9c0-8a4c-4a3d-9b6b-3e5e4a5d6f7c', 'DIURNO', CURRENT_DATE);`);

    // 3. Listas Ordenadas según Planillas Reales del Obelisco
    const ORDEN_COCINA = [
      "Aceite Lt.",       
      "Aceitunas", 
      "Aji verde", 
      "Carne Ave Persona", 
      "Carne Ave.Gigante", 
      "Carne churrasco gig", 
      "Carne churrasco pers", 
      "Carne Hamburg Gigant.", 
      "Carne hamburg. Porc.", 
      "Carne lomo gig.", 
      "Carne lomo pers", 
      "Hamburg KING K", 
      "Carne para As Gig.", 
      "Champiñones", 
      "Chorizo", 
      "Choclo", "Lechuga", 
      "Cebolla cruda", 
      "Cebolla Cocida", 
      "Hojarascas", 
      "Huevos", 
      "Jamón", 
      "Menu 1 Pulpa/ Chuleta", 
      "Menú 2 Pangasius", 
      "Menú 3 Carne Mechada", 
      "Menu 4 costillar", 
      "Tortilla De Wrap", 
      "Papas grandes 700gr", 
      "Papas personal 350gr", 
      "Papas personal 150gr", 
      "Porcion Pino Marisco", 
      "Porcion Pino Carne", 
      "Porciones de camarones", 
      "Crema", 
      "Palmitos", 
      "Paltas", 
      "Pan fricas", 
      "Pan hallullon", 
      "Pan Brioche 12", 
      "Pan mesa Gigante", 
      "Pan mesa Personal", 
      "Pan mesa super Gigan", 
      "Pepinillos", 
      "Porotos verdes Kg.", 
      "Queso laminado", 
      "Tocino porciones", 
      "Tomates Kg.", 
      "Vienesas doggi",
       "Vienesas personal", 
       "Arroz", 
       "Cheddar porc", 
       "Sopaipillas"
    ];

    const ORDEN_CAJA = [
      "Ají en salsa 1 Kg", 
      "Atún", 
      "Agua mineral 1 1/2", 
      "Aquarius y mineral 500cc", 
      "Agua litro", 
      "Bebida lata", 
      "Bebidas 1.5 litro", 
      "Coca Cola 500cc.", 
      "Jugo nectar 11/2 litros", 
      "Jugo nectar individual", 
      "Monster", "RedBull", 
      "Barril Quilmes (tara 11.00)", 
      "Barril Cristal (tara 9.54)", 
      "Cerv Stella ret 1 Lt", 
      "Cerv Escudo Ret 1Lt", 
      "Cerv Heineken ret 1 Lt", 
      "Cerv Cristal ret 1 lt", 
      "Cerv Royal ret 1 lt", 
      "Cerveza SolRet 710cc", 
      "Cerveza Bot Cristal 355cc", 
      "Cerveza Bot Austral", 
      "Cerveza Bot Escudo 355cc", 
      "Cerveza Bot Heineken 355cc", 
      "Cerveza Sol botellín", 
      "Cerveza botella Royal 355cc", 
      "Cerveza botella Kunstman", 
      "Cerveza Botella Corona", 
      "Cerveza lata Austral 1/2 lt", 
      "Cerveza lata Cristal 1/2 lt", 
      "Cerveza lata escudo 1/2 lt", 
      "Cerveza Heineken 1/2 lt", 
      "Cerveza Royal 1/2 lt", 
      "Cerveza Torobayo 1/2 lt", 
      "Cerveza Escudo Silver 1/2",
       "Cerveza Coors 1/2 lt", 
       "Cerveza lata pers Escudo", 
      "Cerveza lata pers. Cristal", 
      "Cerveza Heineken lata pers.",
       "Cerveza Royal lata pers.", 
      "Cerveza lata lemon stone", 
      "Emp. Horno Pino Carne", 
      "Emp. Horno marisco", 
      "Ketchup", 
      "Limones", 
      "Mostaza", 
      "Sal sachet", 
      "Servilletas bolsas", 
      "Sobres de café", 
      "Sobres de te", 
      "salsa americana", 
      "Chucrut"
    ];

    // 4. Inserción de Ingredientes COCINA
    console.log(chalk.gray(`   - Inserting ${ORDEN_COCINA.length} items for COCINA...`));
    for (let i = 0; i < ORDEN_COCINA.length; i++) {
      await db.query(
        'INSERT INTO "ingredientes" ("nombre_visible", "tipo", "unidad", "orden") VALUES ($1, $2, $3, $4)', 
        [ORDEN_COCINA[i], 'COCINA', 'unidades', i + 1]
      );
    }

    // 5. Inserción de Ingredientes CAJA
    console.log(chalk.gray(`   - Inserting ${ORDEN_CAJA.length} items for CAJA...`));
    for (let i = 0; i < ORDEN_CAJA.length; i++) {
      await db.query(
        'INSERT INTO "ingredientes" ("nombre_visible", "tipo", "unidad", "orden") VALUES ($1, $2, $3, $4)', 
        [ORDEN_CAJA[i], 'CAJA', 'unidades', i + 1]
      );
    }

    await db.query('COMMIT');
    console.log(chalk.green('✓ Database seeded successfully with synchronized EXACT ORDER.'));

    res.status(200).json({ 
      message: 'Base de datos sincronizada con el orden exacto de las planillas del Obelisco.',
      cocinaCount: ORDEN_COCINA.length,
      cajaCount: ORDEN_CAJA.length
    });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error(chalk.red('✗ Error during database seeding:'), error);
    res.status(500).json({ message: 'Error al sincronizar la base de datos.' });
  }
});

export default router;
