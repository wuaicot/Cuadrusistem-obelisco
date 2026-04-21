import { Pool } from 'pg';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const dbConfig = process.env.DATABASE_URL 
  ? { 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      user: String(process.env.DB_USER || 'postgres'),
      password: String(process.env.DB_PASSWORD || ''),
      host: String(process.env.DB_HOST || 'localhost'),
      port: Number(process.env.DB_PORT || 5432),
      database: String(process.env.DB_NAME || 'cuadrusistem'),
      ssl: process.env.DB_HOST?.includes('localhost') ? false : { rejectUnauthorized: false }
    };

// Log de configuración (sin password)
const logConfig = { ...dbConfig };
if ('password' in logConfig) (logConfig as any).password = '****';
console.log(chalk.yellow('Intentando conectar a DB con:'), logConfig);

const pool = new Pool(dbConfig);

pool.on('connect', () => {
  const host = 'connectionString' in dbConfig ? (dbConfig as any).connectionString.split('@')[1] : `${dbConfig.host}:${dbConfig.port}`;
  console.log(chalk.bgCyan.black(` INFO `) + chalk.cyan(` Conectado a PostgreSQL en: ${host} (BD: ${dbConfig.database || 'vía URL'})`));
});

pool.on('error', (err) => {
  console.error(chalk.red('✗ Error crítico en el pool de base de datos:'), err.message);
});

export default {
  query: (text: string, params: any[] = []) => pool.query(text, params),
};
