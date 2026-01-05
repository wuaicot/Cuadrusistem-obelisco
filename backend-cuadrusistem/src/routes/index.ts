import { Router } from 'express';
import ingredientesRoutes from './ingredientes.routes';
import localesRoutes from './locales.routes';
import turnosRoutes from './turnos.routes';
import planillasRoutes from './planillas.routes';
import reporteZRoutes from './reporte-z.routes'; // Importar la nueva ruta

const router = Router();

router.use('/ingredientes', ingredientesRoutes);
router.use('/locales', localesRoutes);
router.use('/turnos', turnosRoutes);
router.use('/planillas', planillasRoutes);
router.use('/reporte-z', reporteZRoutes); // Registrar la nueva ruta

// You can add other routes here as needed, based on the frontend structure
// For example, if you had /api/admin, /api/cuadratur, etc.

export default router;
