import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

async function initDb() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error(chalk.red('\n✗ Error: No se encontró DATABASE_URL.'));
    process.exit(1);
  }

  console.log(chalk.blue(' tentando conectar a la base de datos remota...'));

  // Intentamos primero SIN SSL (ya que el error anterior fue "The server does not support SSL")
  let client = new Client({
    connectionString,
    // Eliminamos la configuración de SSL forzada
  });

  try {
    await client.connect();
    console.log(chalk.green('✓ Conexión establecida (Sin SSL).\n'));
  } catch (err: any) {
    if (err.message.includes('SSL connection is required')) {
        console.log(chalk.yellow('Reintentando con SSL (Requerido por el servidor)...'));
        client = new Client({
            connectionString,
            ssl: { rejectUnauthorized: false }
        });
        await client.connect();
        console.log(chalk.green('✓ Conexión establecida (Con SSL).\n'));
    } else {
        throw err;
    }
  }

  try {
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log(chalk.yellow('Ejecutando comandos SQL...'));
    await client.query(schemaSql);

    console.log(chalk.bgGreen.black('\n ✓ ¡Base de Datos Inicializada Correctamente! \n'));

  } catch (err: any) {
    console.error(chalk.red('\n✗ Error durante la ejecución del SQL:'));
    console.error(chalk.white(err.message));
  } finally {
    await client.end();
  }
}

initDb();
