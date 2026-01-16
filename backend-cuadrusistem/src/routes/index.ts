import { Router } from 'express';
import ingredientesRoutes from './ingredientes.routes';
import localesRoutes from './locales.routes';
import planillasRoutes from './planillas.routes';
import reporteZRoutes from './reporte-z.routes';
import turnosRoutes from './turnos.routes';
import debugRoutes from './debug.routes'; // Importar las rutas de debug

import cuadreRoutes from './cuadre.routes';

const router = Router();

// Rutas de la aplicación
router.use('/ingredientes', ingredientesRoutes);
router.use('/locales', localesRoutes);
router.use('/planillas', planillasRoutes);
router.use('/reporte-z', reporteZRoutes);
router.use('/turnos', turnosRoutes);
router.use('/cuadre', cuadreRoutes); // <-- Añadir la nueva ruta de cuadre

// Rutas de Debug (solo para desarrollo)
router.use('/debug', debugRoutes);

export default router;
