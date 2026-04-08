import { Pool } from 'pg';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const dbConfig = {
  user: String(process.env.DB_USER || 'postgres'),
  password: String(process.env.DB_PASSWORD || ''),
  host: String(process.env.DB_HOST || 'localhost'),
  port: Number(process.env.DB_PORT || 5432),
  database: String(process.env.DB_NAME || 'railway'),
  ssl: process.env.DB_HOST?.includes('localhost') ? false : { rejectUnauthorized: false }
};

const pool = new Pool(dbConfig);

pool.on('connect', () => {
  console.log(chalk.green(`✓ Conectado a PostgreSQL en ${dbConfig.host}`));
});

pool.on('error', (err) => {
  console.error(chalk.red('✗ Error crítico en el pool de base de datos:'), err.message);
});

export default {
  query: (text: string, params: any[] = []) => pool.query(text, params),
};
