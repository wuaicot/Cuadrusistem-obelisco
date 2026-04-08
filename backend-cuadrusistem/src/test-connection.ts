import { Client } from 'pg';
import chalk from 'chalk';

async function test() {
  const client = new Client({
    user: 'postgres',
    host: 'junction.proxy.rlwy.net',
    database: 'railway',
    password: 'usMTgKVtCQngcmXrmUShDfMblUMDZQuz',
    port: 19288,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log(chalk.green('✓ Conexión exitosa a Railway con parámetros manuales.'));
    const res = await client.query('SELECT current_database(), now();');
    console.log(res.rows[0]);
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log(chalk.blue('\nTablas encontradas:'));
    console.table(tables.rows);

  } catch (err: any) {
    console.error(chalk.red('✗ Error de conexión:'), err.message);
  } finally {
    await client.end();
  }
}

test();
