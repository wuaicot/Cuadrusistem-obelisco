import { Pool } from 'pg';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

pool.on('connect', () => {
  console.log(chalk.green('✓ Conectado a la base de datos PostgreSQL.'));
});

pool.on('error', (err) => {
  console.error(chalk.red('✗ Error inesperado en el cliente de la base de datos'), err);
  process.exit(-1);
});

export default {
  /**
   * Ejecuta una consulta SQL en la base de datos.
   * @param text La consulta SQL a ejecutar.
   * @param params Los parámetros para la consulta.
   * @returns El resultado de la consulta.
   */
  query: (text: string, params: any[] = []) => pool.query(text, params),
};
