import { Client } from 'pg';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend-cuadrusistem/.env' });

async function verifyData() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log(chalk.green('✓ Conectado para verificación de datos.\n'));

    const tables = ['locales', 'turnos', 'ingredientes'];
    for (const table of tables) {
      const res = await client.query(`SELECT COUNT(*) FROM "${table}"`);
      console.log(chalk.cyan(`Tabla "${table}": ${res.rows[0].count} registros.`));
      
      if (parseInt(res.rows[0].count) > 0) {
        const data = await client.query(`SELECT * FROM "${table}" LIMIT 2`);
        console.log(`Muestra de datos en ${table}:`);
        console.table(data.rows);
      }
    }

  } catch (err: any) {
    console.error(chalk.red('✗ Error:'), err.message);
  } finally {
    await client.end();
    process.exit(0);
  }
}

verifyData();
