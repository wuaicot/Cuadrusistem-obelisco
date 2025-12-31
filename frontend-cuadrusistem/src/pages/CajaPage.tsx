import { PlanillaGrid } from '../components/planillas/PlanillaGrid';
import { TipoPlanilla } from '../types/enums';

export function CajaPage() {
  return <PlanillaGrid tipo={TipoPlanilla.CAJA} />;
}
