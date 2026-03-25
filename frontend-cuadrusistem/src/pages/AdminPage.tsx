import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReporteZUpload } from '../components/reportes-z/ReporteZUpload';
import { CuadreDisplay } from '../components/cuadre/CuadreDisplay';

export function AdminPage() {
  const [reporteZRefreshKey, setReporteZRefreshKey] = useState(0);
  const navigate = useNavigate();

  const handleReporteZUploadSuccess = () => {
    setReporteZRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Quick Actions / Mobile Navigation */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/admin/precios')}
          className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-left group"
        >
          <span className="text-4xl group-hover:scale-110 transition-transform">💰</span>
          <div>
            <h3 className="text-xl font-bold">Precios por Proveedor</h3>
            <p className="text-blue-100 text-sm opacity-90">Compara precios y busca ofertas en el mercado.</p>
          </div>
        </button>

        <div className="flex items-center gap-4 p-6 bg-white text-gray-800 rounded-2xl shadow shadow-blue-100 border border-blue-50">
          <span className="text-4xl">📊</span>
          <div>
            <h3 className="text-xl font-bold">Estado del Día</h3>
            <p className="text-gray-500 text-sm">Gestiona tus reportes Z y cuadres de inventario.</p>
          </div>
        </div>
      </section>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
          Carga de Reporte Z
        </h2>
        <ReporteZUpload onUploadSuccess={handleReporteZUploadSuccess} />
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-green-500 rounded-full"></span>
          Resultados de Cuadre
        </h2>
        <CuadreDisplay reporteZRefreshKey={reporteZRefreshKey} />
      </div>
    </div>
  );
}
