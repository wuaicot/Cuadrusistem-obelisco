import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

async function initDb() {
  console.log(chalk.blue('Intentando conectar con parámetros de .env...'));

  const clientConfig = process.env.DATABASE_URL 
    ? { 
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '5432'),
        ssl: process.env.DB_HOST?.includes('localhost') ? false : { rejectUnauthorized: false }
      };

  const client = new Client(clientConfig);

  try {
    await client.connect();
    console.log(chalk.green('✓ Conexión establecida.\n'));

    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log(chalk.yellow('Ejecutando comandos SQL desde schema.sql...'));
    await client.query(schemaSql);

    console.log(chalk.bgGreen.black('\n ✓ ¡Base de Datos Inicializada Correctamente! \n'));

  } catch (err: any) {
    console.error(chalk.red('\n✗ Error durante la ejecución del SQL:'));
    console.error(err.message);
  } finally {
    await client.end();
    process.exit(0);
  }
}

initDb();
