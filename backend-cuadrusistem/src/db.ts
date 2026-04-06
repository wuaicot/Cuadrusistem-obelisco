import { Pool } from 'pg';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

// Priorizamos la cadena de conexión completa (DATABASE_URL) que es el estándar de Railway
const connectionString = process.env.DATABASE_URL;

const pool = connectionString 
  ? new Pool({ 
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
    })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    });

pool.on('connect', () => {
  const mode = connectionString ? 'URL' : 'Params';
  console.log(chalk.green(`✓ Conectado a PostgreSQL (Modo: ${mode}).`));
});

pool.on('error', (err) => {
  console.error(chalk.red('✗ Error inesperado en el cliente de la base de datos'), err);
  process.exit(-1);
});

export default {
  query: (text: string, params: any[] = []) => pool.query(text, params),
};
