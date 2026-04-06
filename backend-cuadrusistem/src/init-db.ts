import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

async function initDb() {  
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error(chalk.red('\n✗ Error: No se encontró la variable DATABASE_URL en el archivo .env'));
    console.log(chalk.yellow('Sigue estos pasos:\n'));
    console.log('1. Ve a Railway -> Tu Postgres -> Variables.');
    console.log('2. Copia el valor de DATABASE_URL.');
    console.log('3. Pégalo en tu archivo backend-cuadrusistem/.env así:');
    console.log(chalk.cyan('   DATABASE_URL=postgres://usuario:password@host:puerto/db_name\n'));
    process.exit(1);
  }

  console.log(chalk.blue('intentando conectar a la base de datos remota...'));

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Obligatorio para conectar desde fuera de Railway
    }
  });

  try {
    await client.connect();
    console.log(chalk.green('✓ Conexión establecida con éxito.\n'));

    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    console.log(chalk.gray(`Leyendo archivo: ${schemaPath}`));
    
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log(chalk.yellow('Ejecutando comandos SQL...'));
    await client.query(schemaSql);

    console.log(chalk.bgGreen.black('\n ✓ ¡Base de Datos Inicializada Correctamente! \n'));
    console.log(chalk.white('Las tablas y los datos de ejemplo han sido creados en Railway.\n'));

  } catch (err: any) {
    console.error(chalk.red('\n✗ Error durante la inicialización:'));
    console.error(chalk.white(err.message));
  } finally {
    await client.end();
  }
}

initDb();
