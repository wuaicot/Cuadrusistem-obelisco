import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  // Dummy data for ingredients
  const ingredientes = [
    { id: '1', nombre: 'Pan de Hamburguesa', unidad: 'unidad' },
    { id: '2', nombre: 'Carne de Res 150g', unidad: 'unidad' },
    { id: '3', nombre: 'Queso Cheddar', unidad: 'gramos' },
    { id: '4', nombre: 'Lechuga', unidad: 'hoja' },
    { id: '5', nombre: 'Tomate', unidad: 'rodaja' },
    { id: '6', nombre: 'Salsa Especial', unidad: 'ml' },
  ];
  res.json(ingredientes);
});

export default router;
