import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  // Dummy data for locales
  const locales = [
    { id: '1', nombre: 'Local Obelisco' },
    { id: '2', nombre: 'Local Piscis' },    
  ];
  res.json(locales);
});

export default router;
