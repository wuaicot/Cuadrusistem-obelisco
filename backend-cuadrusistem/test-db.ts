import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

async function test() {
  try {
    console.log('Intentando conectar a la DB...');
    const res = await pool.query('SELECT current_database(), now()');
    console.log('Conexión exitosa:', res.rows[0]);

    console.log('Listando tablas...');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tablas encontradas:', tables.rows.map(r => r.table_name));

  } catch (err) {
    console.error('Error durante la prueba:', err);
  } finally {
    await pool.end();
  }
}

test();
