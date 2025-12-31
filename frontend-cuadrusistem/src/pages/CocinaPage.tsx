import { PlanillaGrid } from '../components/planillas/PlanillaGrid';
import { TipoPlanilla } from '../types/enums';

export function CocinaPage() {
  return <PlanillaGrid tipo={TipoPlanilla.COCINA} />;
}
