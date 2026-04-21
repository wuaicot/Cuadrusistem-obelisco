import { Pool } from 'pg';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

let connectionString = process.env.DATABASE_URL;

if (connectionString) {
  try {
    const dbUrl = new URL(connectionString);
    // Si la base de datos es 'railway' o está vacía, forzamos 'cuadrusistem'
    if (dbUrl.pathname === '/railway' || dbUrl.pathname === '/' || !dbUrl.pathname) {
      console.log(chalk.magenta(`-> Cambiando base de datos en URL de "${dbUrl.pathname}" a "/cuadrusistem"`));
      dbUrl.pathname = '/cuadrusistem';
      connectionString = dbUrl.toString();
    }
  } catch (e) {
    console.error(chalk.red('Error al parsear DATABASE_URL:'), e);
  }
}

const dbConfig = connectionString 
  ? { 
      connectionString: connectionString,
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

// Log de configuración (ocultando datos sensibles)
const logSafe = connectionString 
  ? { connectionString: connectionString.replace(/:.*@/, ':****@') }
  : { ...dbConfig, password: '****' };

console.log(chalk.yellow('Configuración de DB final:'), logSafe);

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
