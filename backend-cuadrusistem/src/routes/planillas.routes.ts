import { Router, Request, Response } from 'express';
import chalk from 'chalk';

const router = Router();

// Interfaz que define la estructura de datos que esperamos del frontend.
// Esto debe coincidir con los datos que la nueva UI de la planilla genera.
interface PlanillaItemPayload {
  ingrediente: string; // Codigo del ingrediente
  segmento: string;    // 'SALDO_INICIAL', 'ENTRADA', 'DEVOLUC', 'SALDO_FINAL'
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
 * @route   POST /api/planillas
 * @desc    Crear una nueva planilla
 * @access  Public (temporalmente)
 */
router.post('/', (req: Request, res: Response) => {
  console.log(chalk.blue('POST /api/planillas -> Recibida nueva planilla.'));
  console.log(chalk.yellow('Payload recibido:'));
  console.dir(req.body, { depth: null });

  const payload: CreatePlanillaPayload = req.body;

  // Validación básica para asegurar que los campos principales existen
  if (!payload.fecha || !payload.turnoId || !payload.localId || !Array.isArray(payload.items)) {
    console.log(chalk.red('✗ Error: Faltan campos obligatorios en el payload.'));
    return res.status(400).json({ message: 'Faltan campos obligatorios: fecha, turnoId, localId, o items.' });
  }

  // --- Aquí irá la lógica para guardar en la base de datos ---
  // Por ahora, solo simulamos que el proceso fue exitoso.
  
  console.log(chalk.green('✓ Payload validado y procesado exitosamente (simulación).'));

  // Devolvemos una respuesta de éxito (201 Creado)
  res.status(201).json({
    message: 'Planilla recibida y procesada exitosamente.',
    dataReceived: payload,
  });
});

export default router;
