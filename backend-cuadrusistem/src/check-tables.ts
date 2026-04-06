import db from './db';
import chalk from 'chalk';

async function checkTables() {
  try {
    const res = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    if (res.rows.length === 0) {
      console.log(chalk.yellow('\n⚠ No se encontraron tablas en la base de datos pública.\n'));
      console.log('Sugerencia: Ejecuta "npx ts-node src/init-db.ts" para crearlas.');
    } else {
      console.log(chalk.green(`\n✓ Se encontraron ${res.rows.length} tablas:\n`));
      console.table(res.rows);
    }
  } catch (err: any) {
    console.error(chalk.red('\n✗ Error al conectar con la base de datos:'));
    console.error(err.message);
  } finally {
    process.exit(0);
  }
}

checkTables();
