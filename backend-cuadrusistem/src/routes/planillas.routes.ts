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

// (La ruta GET no cambia por ahora)
router.get('/', (req: Request, res: Response) => {
  const tipo = req.query.tipo;
  console.log(chalk.blue(`GET /api/planillas -> Consultando planillas de tipo: ${tipo || 'todos'}`));
  // TODO: Implementar la lógica para buscar en la base de datos
  res.status(200).json([]);
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
