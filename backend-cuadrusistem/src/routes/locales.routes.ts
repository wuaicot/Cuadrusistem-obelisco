import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  // Dummy data for locales
  const locales = [
    { id: '1', nombre: 'Sucursal Centro' },
    { id: '2', nombre: 'Sucursal Norte' },
    { id: '3', nombre: 'Sucursal Sur' },
  ];
  res.json(locales);
});

export default router;
