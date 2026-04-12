import { Router, Request, Response } from 'express';
import chalk from 'chalk';
import db from '../db'; // Importar la configuración de la base de datos

const router = Router();

// (Las interfaces no cambian)
interface PlanillaItemPayload {
  ingrediente: string;
  segmento: string;
  cantidad: number;
}

interface CreatePlanillaPayload {
  fecha: string;
  tipo: 'COCINA' | 'CAJA';
  turnoId: string;
  localId: string;
  items: PlanillaItemPayload[];
}

/**
 * @route   GET /api/planillas/saldo-anterior
 * @desc    Obtiene el saldo final del turno anterior para usarlo como saldo inicial.
 */
router.get('/saldo-anterior', async (req: Request, res: Response) => {
  const { localId, turnoId, tipo } = req.query;

  if (!localId || !turnoId || !tipo) {
    return res.status(400).json({ message: 'Faltan parámetros: localId, turnoId o tipo.' });
  }

  try {
    // 1. Obtener info del turno actual
    const currentTurnoRes = await db.query('SELECT tipo, fecha FROM turnos WHERE id = $1', [turnoId]);
    if (currentTurnoRes.rows.length === 0) return res.status(404).json({ message: 'Turno no encontrado.' });
    
    const { tipo: currentTipo, fecha: currentFecha } = currentTurnoRes.rows[0];
    
    // 2. Determinar turno anterior
    let prevTipo = '';
    let prevFecha = currentFecha;

    if (currentTipo === 'TARDE') {
      prevTipo = 'MAÑANA';
    } else {
      prevTipo = 'TARDE';
      const d = new Date(currentFecha);
      d.setDate(d.getDate() - 1);
      prevFecha = d.toISOString().split('T')[0];
    }

    console.log(chalk.blue(`Buscando saldo anterior: Local ${localId}, Tipo ${tipo}, Turno ${prevTipo} (${prevFecha})`));

    // 3. Buscar la planilla del turno anterior
    const prevPlanillaRes = await db.query(`
      SELECT p.id 
      FROM planillas p
      JOIN turnos t ON p.turno_id = t.id
      WHERE p.local_id = $1 AND p.tipo = $2 AND t.tipo = $3 AND t.fecha = $4
      LIMIT 1
    `, [localId, tipo, prevTipo, prevFecha]);

    if (prevPlanillaRes.rows.length === 0) {
      return res.status(200).json({}); // No hay turno anterior, devolvemos vacío
    }

    const prevPlanillaId = prevPlanillaRes.rows[0].id;

    // 4. Obtener los SALDO_FINAL de esa planilla
    const itemsRes = await db.query(`
      SELECT ingrediente_id, cantidad 
      FROM planilla_items 
      WHERE planilla_id = $1 AND segmento = 'SALDO_FINAL'
    `, [prevPlanillaId]);

    const saldos: Record<string, number> = {};
    itemsRes.rows.forEach(row => {
      saldos[row.ingrediente_id] = row.cantidad;
    });

    res.status(200).json(saldos);

  } catch (error) {
    console.error(chalk.red('Error al obtener saldo anterior:'), error);
    res.status(500).json({ message: 'Error interno.' });
  }
});

/**
 * @route   GET /api/planillas
 * @desc    Consultar planillas existentes
 * @access  Public (temporalmente)
 */
router.get('/', async (req: Request, res: Response) => {
  const tipo = req.query.tipo as string;
  console.log(chalk.blue(`GET /api/planillas -> Consultando planillas de tipo: ${tipo || 'todos'}`));

  try {
    const queryParams: any[] = [];
    let queryText = `
      SELECT p.id, p.fecha, p.tipo, t.tipo as turno_tipo, l.nombre as local_nombre
      FROM "planillas" p
      LEFT JOIN "turnos" t ON p.turno_id = t.id
      LEFT JOIN "locales" l ON p.local_id = l.id
    `;

    if (tipo && (tipo.toUpperCase() === 'COCINA' || tipo.toUpperCase() === 'CAJA')) {
      queryText += ` WHERE p.tipo = $1`;
      queryParams.push(tipo.toUpperCase());
    }

    queryText += ` ORDER BY p.fecha DESC, p.created_at DESC;`;

    const { rows } = await db.query(queryText, queryParams);
    console.log(chalk.green(`✓ Encontradas ${rows.length} planillas de tipo ${tipo || 'todos'}.`));
    res.status(200).json(rows);

  } catch (error) {
    console.error(chalk.red('✗ Error al consultar planillas:'), error);
    res.status(500).json({ message: 'Error al consultar las planillas.' });
  }
});

/**
 * @route   POST /api/planillas
 * @desc    Crear una nueva planilla y guardar los datos en la base de datos
 * @access  Public (temporalmente)
 */
router.post('/', async (req: Request, res: Response) => {
  console.log(chalk.blue('POST /api/planillas -> Recibida nueva planilla.'));
  console.log(chalk.yellow('Payload recibido:'));
  console.dir(req.body, { depth: null });

  const payload: CreatePlanillaPayload = req.body;

  if (!payload.fecha || !payload.turnoId || !payload.localId || !Array.isArray(payload.items)) {
    console.log(chalk.red('✗ Error: Faltan campos obligatorios en el payload.'));
    return res.status(400).json({ message: 'Faltan campos obligatorios: fecha, turnoId, localId, o items.' });
  }

  // --- Lógica para guardar en la base de datos ---
  try {
    // Iniciar transacción
    await db.query('BEGIN');
    console.log(chalk.magenta('-> Transacción iniciada.'));

    // 1. Insertar en la tabla 'planillas'
    const planillaInsertQuery = `
      INSERT INTO "planillas" (fecha, tipo, turno_id, local_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const planillaInsertParams = [payload.fecha, payload.tipo, payload.turnoId, payload.localId];
    const planillaResult = await db.query(planillaInsertQuery, planillaInsertParams);
    const newPlanillaId = planillaResult.rows[0].id;
    
    console.log(chalk.cyan(`   - Creada planilla con ID: ${newPlanillaId}`));

    // 2. Insertar cada item en 'planilla_items'
    if (payload.items.length > 0) {
      console.log(chalk.cyan(`   - Insertando ${payload.items.length} items...`));
      for (const item of payload.items) {
        const itemInsertQuery = `
          INSERT INTO "planilla_items" (planilla_id, ingrediente_id, segmento, cantidad)
          VALUES ($1, $2, $3, $4);
        `;
        const itemInsertParams = [newPlanillaId, item.ingrediente, item.segmento, item.cantidad];
        await db.query(itemInsertQuery, itemInsertParams);
      }
      console.log(chalk.cyan(`   - Items insertados correctamente.`));
    }

    // Finalizar transacción
    await db.query('COMMIT');
    console.log(chalk.green('✓ Transacción completada (COMMIT).'));

    res.status(201).json({
      message: 'Planilla guardada exitosamente en la base de datos.',
      planillaId: newPlanillaId,
    });

  } catch (error) {
    // Si hay un error, revertir la transacción
    await db.query('ROLLBACK');
    console.error(chalk.red('✗ Error durante la transacción, ROLLBACK ejecutado.'), error);
    res.status(500).json({ message: 'Error interno del servidor al guardar la planilla.' });
  }
});

export default router;