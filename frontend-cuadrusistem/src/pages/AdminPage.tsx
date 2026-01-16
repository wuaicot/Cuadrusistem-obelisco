import { useState } from 'react';
import { ReporteZUpload } from '../components/reportes-z/ReporteZUpload';
import { CuadreDisplay } from '../components/cuadre/CuadreDisplay';

export function AdminPage() {
  const [reporteZRefreshKey, setReporteZRefreshKey] = useState(0);

  const handleReporteZUploadSuccess = () => {
    setReporteZRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <>
      <ReporteZUpload onUploadSuccess={handleReporteZUploadSuccess} />
      <hr className="my-8" />
      <CuadreDisplay reporteZRefreshKey={reporteZRefreshKey} />
    </>
  );
}
