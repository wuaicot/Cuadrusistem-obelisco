import http from 'http';
import chalk from 'chalk';

async function get(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', (err) => reject(err));
  });
}

async function testApi() {
  const urls = [
    'http://localhost:3000/api/locales',
    'http://localhost:3000/api/turnos',
    'http://localhost:3000/api/ingredientes?tipo=COCINA'
  ];

  for (const url of urls) {
    try {
      console.log(chalk.blue(`Probando: ${url}`));
      const res = await get(url);
      console.log(chalk.green(`✓ Status: ${res.status}`));
      const data = res.data;
      console.log(`Registros recibidos: ${Array.isArray(data) ? data.length : 'No es un array'}`);
      if (Array.isArray(data) && data.length > 0) {
        console.log('Primer registro:', JSON.stringify(data[0], null, 2));
      } else {
        console.log('Respuesta cruda:', data);
      }
    } catch (err: any) {
      console.error(chalk.red(`✗ Error en ${url}:`), err.message);
    }
    console.log('---');
  }
}

testApi();
