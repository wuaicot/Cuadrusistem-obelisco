import { ReporteZUpload } from '../components/reportes-z/ReporteZUpload';
import { CuadreDisplay } from '../components/cuadre/CuadreDisplay';

export function AdminPage() {
  return (
    <>
      <ReporteZUpload />
      <hr className="my-8" />
      <CuadreDisplay />
    </>
  );
}
