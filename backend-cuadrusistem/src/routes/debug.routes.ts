// backend-cuadrusistem/src/routes/debug.routes.ts
import { Router, Request, Response } from 'express';
import db from '../db';
import chalk from 'chalk';
import crypto from 'crypto';

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
    
    // Insertar los dos turnos estandarizados
    await db.query(`INSERT INTO "turnos" (id, tipo, fecha) VALUES ('b1f5e9c0-8a4c-4a3d-9b6b-3e5e4a5d6f7c', '1er Turno', CURRENT_DATE);`);
    await db.query(`INSERT INTO "turnos" (id, tipo, fecha) VALUES ('c1f5e9c0-8a4c-4a3d-9b6b-3e5e4a5d6f7d', '2do Turno', CURRENT_DATE);`);

    // 3. Listas Ordenadas según Planillas Reales del Obelisco
    const ORDEN_COCINA = [
      "Aceite Lt.",       
      "Aceitunas", 
      "Aji verde", 
      "Carne Ave Personal", 
      "Carne Ave.Gigante", 
      "Carne churrasco gig", 
      "Carne churrasco pers.", 
      "Carne Hamburg Gigant.", 
      "Carne hamburg. Porc.", 
      "Carne lomo gig.", 
      "Carne lomo pers.", 
      "Hamburg KING K", 
      "Carne para As Gig.", 
      "Champiñones", 
      "Chorizo", 
      "Choclo", 
      "Lechuga", 
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
      "Pan mesa super Gigan.", 
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
      "COCA COLA LATA", 
      "Bebidas 1.5 litro", 
      "COCA COLA 591CC", 
      "Jugo nectar 11/2 litros", 
      "Juao nectar individual", 
      "MONSTER BEBIDA ENERG", 
      "RedBull", 
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
      "Cerveza botella Corona", 
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

    // Mapa de costos base para el seed
    const COSTOS: Record<string, number> = {
      "Vienesas personal": 257.92,
      "Vienesas doggi": 332.03,
      "Pan mesa Personal": 150.00,
      "Pan mesa Gigante": 220.00,
      "Pan mesa super Gigan.": 310.00,
      "Carne para As Gig.": 1077.73,
      "Carne churrasco pers.": 1077.73,
      "Carne churrasco gig": 2155.54,
      "Carne Ave Personal": 806.82, // Calculado desde GAG
      "Carne lomo pers.": 1250.00, // Estimado mercado
      "Carne Hamburg Gigant.": 980.00, // Estimado mercado
      "Pan fricas": 180.00,
      "Pan hallullon": 200.00,
      "Queso laminado": 212.43,
      "Huevos": 120.00,
      "Chorizo": 222.18,
      "Tocino porciones": 137.35,
      "Hojarascas": 268.90,
      "COCA COLA LATA": 648.77,
      "COCA COLA 591CC": 766.83,
      "Cerv Stella ret 1 Lt": 1457.70,
      "Cerveza Torobayo 1/2 lt": 1516.20,
      "Agua mineral 1 1/2": 1956.36,
      "Ketchup": 1599.70,
      "Mostaza": 1020.00,
      "Chucrut": 1590.00,
      "Pepinillos": 3590.00,
      "Sal sachet": 6500.00,
      "Arroz": 5191.20,
      "Menú 2 Pangasius": 2790.00,
      "Menú 3 Carne Mechada": 1450.00,
      "DELIVERY      APP": 0, // Ignorar financieramente
    };

    // Helper para generar UUIDs deterministas basados en el nombre
    const generateUUID = (name: string) => {
      const hash = crypto.createHash('md5').update(name).digest('hex');
      return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-${hash.substring(12, 16)}-${hash.substring(16, 20)}-${hash.substring(20, 32)}`;
    };

    // 4. Inserción de Ingredientes COCINA
    console.log(chalk.gray(`   - Inserting ${ORDEN_COCINA.length} items for COCINA...`));
    for (let i = 0; i < ORDEN_COCINA.length; i++) {
      const name = ORDEN_COCINA[i];
      const costo = COSTOS[name] || 0;
      await db.query(
        'INSERT INTO "ingredientes" ("id", "nombre_visible", "tipo", "unidad", "costo_neto", "orden") VALUES ($1, $2, $3, $4, $5, $6)', 
        [generateUUID(name + 'COCINA'), name, 'COCINA', 'unidades', costo, i + 1]
      );
    }

    // 5. Inserción de Ingredientes CAJA
    console.log(chalk.gray(`   - Inserting ${ORDEN_CAJA.length} items for CAJA...`));
    for (let i = 0; i < ORDEN_CAJA.length; i++) {
      const name = ORDEN_CAJA[i];
      const costo = COSTOS[name] || 0;
      await db.query(
        'INSERT INTO "ingredientes" ("id", "nombre_visible", "tipo", "unidad", "costo_neto", "orden") VALUES ($1, $2, $3, $4, $5, $6)', 
        [generateUUID(name + 'CAJA'), name, 'CAJA', 'unidades', costo, i + 1]
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