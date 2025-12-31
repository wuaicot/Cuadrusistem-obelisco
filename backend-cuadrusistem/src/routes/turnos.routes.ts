import { Router } from 'express';

// Redefine TurnoTipo locally for backend compilation
enum TurnoTipo {
  MANANA = 'MANANA',
  TARDE = 'TARDE',
}

const router = Router();

router.get('/', (req, res) => {
  // Dummy data for turnos
  const turnos = [
    { id: 't1', tipo: TurnoTipo.MANANA, fecha: '2025-12-31' },
    { id: 't2', tipo: TurnoTipo.TARDE, fecha: '2025-12-31' },
  ];
  res.json(turnos);
});

export default router;
