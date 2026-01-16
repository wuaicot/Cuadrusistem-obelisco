import { Router, Request, Response } from 'express';
import chalk from 'chalk';
import db from '../db';
import { BEBESTIBLES, MENUS, EMPANADAS } from '../domain/recetas'; // Importar desde un archivo separado

const router = Router();

interface CuadrePayload {
  reporteZId: string;
  planillaCocinaId: string;
  planillaCajaId: string;
}

// ============================================================================
// // LÓGICA DE CÁLCULO DEL CUADRE
// ============================================================================

// Combinar todas las recetas en un solo objeto para búsqueda fácil
const RECETARIO_COMPLETO = { ...MENUS, ...EMPANADAS, ...BEBESTIBLES };


/**
 * @route   POST /api/cuadre
 * @desc    Procesa el cuadre comparando un Reporte Z con las planillas de Cocina y Caja.
 * @access  Public (for now)
 */
router.post('/', async (req: Request, res: Response) => {
  console.log(chalk.blue('POST /api/cuadre -> Solicitud de procesamiento de cuadre recibida.'));
  const { reporteZId, planillaCocinaId, planillaCajaId } = req.body as CuadrePayload;

  if (!reporteZId || !planillaCocinaId || !planillaCajaId) {
    return res.status(400).json({ message: 'Faltan los IDs del Reporte Z o de las planillas.' });
  }

  console.log(chalk.yellow('Payload recibido:'), req.body);

  try {
    await db.query('BEGIN');
    console.log(chalk.magenta('-> Transacción de Cuadre iniciada.'));

    // 1. Obtener todos los datos necesarios en paralelo
    const [
      reporteZResult,
      planillasItemsResult,
      ingredientesResult
    ] = await Promise.all([
      db.query('SELECT items FROM "reporte_z" WHERE id = $1', [reporteZId]),
      db.query('SELECT ingrediente_id, segmento, cantidad FROM "planilla_items" WHERE planilla_id = ANY($1::uuid[])', [[planillaCocinaId, planillaCajaId]]),
      db.query('SELECT id, "nombreVisible" FROM "ingredientes"')
    ]);

    if (reporteZResult.rows.length === 0) throw new Error('No se encontró el Reporte Z.');
    
    // Mapas para búsqueda rápida de ingredientes por ID y por Nombre
    const ingredientesMap = new Map(ingredientesResult.rows.map(ing => [ing.id, ing.nombreVisible]));
    const ingredientesNombreMap = new Map(ingredientesResult.rows.map(ing => [ing.nombreVisible, ing.id]));

    // 2. Calcular Uso Teórico (basado en Reporte Z y Recetario)
    const ventas = reporteZResult.rows[0].items as { codigo: string; cantidad: number }[];
    const usoTeorico = new Map<string, number>(); // <ingredienteId, cantidad>

    console.log(chalk.cyan('--- Calculando Uso Teórico ---'));
    for (const venta of ventas) {
      const receta = RECETARIO_COMPLETO[venta.codigo as keyof typeof RECETARIO_COMPLETO];
      if (receta) {
        // Para bebestibles que no tienen 'ingredientes' pero son un ingrediente en sí mismos
        if (!receta.ingredientes || receta.ingredientes.length === 0) {
            const ingredienteId = ingredientesNombreMap.get(receta.nombre);
            if (ingredienteId) {
                const cantidadNecesaria = venta.cantidad;
                usoTeorico.set(ingredienteId, (usoTeorico.get(ingredienteId) || 0) + cantidadNecesaria);
                console.log(`  - Venta [${venta.codigo}] ${receta.nombre}: ${venta.cantidad} un. -> Uso Teórico: ${cantidadNecesaria} de ${receta.nombre}`);
            }
        } else { // Para Menus y Empanadas con lista de ingredientes
            for (const itemReceta of receta.ingredientes) {
                const ingredienteId = ingredientesNombreMap.get(itemReceta.nombre);
                if (ingredienteId) {
                    const cantidadNecesaria = itemReceta.cantidad * venta.cantidad;
                    usoTeorico.set(ingredienteId, (usoTeorico.get(ingredienteId) || 0) + cantidadNecesaria);
                    console.log(`  - Venta [${venta.codigo}] ${receta.nombre}: ${venta.cantidad} un. -> Uso Teórico: ${cantidadNecesaria} de ${itemReceta.nombre}`);
                }
            }
        }
      }
    }
    console.log(chalk.cyan('-----------------------------'));


    // 3. Calcular Uso Real (basado en Planillas)
    console.log(chalk.cyan('--- Calculando Uso Real ---'));
    const usoRealSource = new Map<string, { [segmento: string]: number }>();
    for (const item of planillasItemsResult.rows) {
      if (!usoRealSource.has(item.ingrediente_id)) {
        usoRealSource.set(item.ingrediente_id, {});
      }
      usoRealSource.get(item.ingrediente_id)![item.segmento] = item.cantidad;
    }

    const usoReal = new Map<string, number>();
    for (const [ingredienteId, segmentos] of usoRealSource.entries()) {
      const inicial = segmentos['SALDO_INICIAL'] || 0;
      const entrada = segmentos['ENTRADA'] || 0;
      const devolucion = segmentos['DEVOLUC'] || 0;
      const final = segmentos['SALDO_FINAL'] || 0;
      
      // FÓRMULA CORREGIDA
      const consumo = (inicial + entrada - devolucion) - final;
      usoReal.set(ingredienteId, consumo);
      const nombreIng = ingredientesMap.get(ingredienteId) || 'Desconocido';
      console.log(`  - [${nombreIng}]: (Inicial ${inicial} + Entrada ${entrada} - Devolución ${devolucion}) - Final ${final} = Consumo Real ${consumo}`);
    }
    console.log(chalk.cyan('-------------------------'));

    // 4. Comparar y generar el detalle del resultado
    const todosIngredientesIds = new Set([...ingredientesMap.keys()]);
    const detalle: Record<string, { teorico: number, real: number, diferencia: number }> = {};

    for (const ingredienteId of todosIngredientesIds) {
      const nombreIngrediente = ingredientesMap.get(ingredienteId)!;
      const teorico = usoTeorico.get(ingredienteId) || 0;
      const real = usoReal.get(ingredienteId) || 0;
      
      // Solo incluir en el reporte si hubo consumo teórico o real
      if (teorico !== 0 || real !== 0) {
        detalle[nombreIngrediente] = {
          teorico,
          real,
          diferencia: real - teorico
        };
      }
    }

    // 5. Marcar Reporte Z como procesado
    await db.query('UPDATE "reporte_z" SET procesado = true WHERE id = $1', [reporteZId]);
    console.log(chalk.cyan(`   - Marcado Reporte Z ${reporteZId} como procesado.`));
    
    // 6. Finalizar transacción y devolver resultado
    await db.query('COMMIT');
    console.log(chalk.green('✓ Cuadre procesado y transacción completada.'));

    res.status(200).json({ detalle });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error(chalk.red('✗ Error al procesar el cuadre, transacción revertida.'), error);
    res.status(500).json({ message: 'Error interno al procesar el cuadre.' });
  }
});

export default router;
