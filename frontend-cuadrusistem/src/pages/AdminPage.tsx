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
    <div className="max-w-4xl mx-auto space-y-6 p-3 sm:p-6 fade-in pb-12">
      {/* Quick Actions / Mobile Navigation */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/admin/precios')}
          className="flex items-center gap-5 p-5 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-[2rem] shadow-xl shadow-indigo-100 hover:shadow-2xl transition-all active:scale-95 text-left group border border-indigo-400/20"
        >
          <div className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-2xl text-4xl group-hover:scale-110 transition-transform">💰</div>
          <div>
            <h3 className="text-xl font-black tracking-tight">Precios por Proveedor</h3>
            <p className="text-indigo-100 text-xs opacity-80 mt-1">Busca ofertas y compara precios.</p>
          </div>
        </button>

        <div className="flex items-center gap-5 p-5 bg-white text-gray-800 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="w-16 h-16 flex items-center justify-center bg-green-50 text-green-600 rounded-2xl text-4xl">📊</div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-gray-800">Estado del Día</h3>
            <p className="text-gray-500 text-xs mt-1">Reportes Z y cuadres de inventario.</p>
          </div>
        </div>
      </section>

      <div className="space-y-6">
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100">
          <header className="mb-6">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-8 h-[2px] bg-indigo-600"></span>
              Carga de Reporte Z
            </h2>
          </header>
          <ReporteZUpload onUploadSuccess={handleReporteZUploadSuccess} />
        </div>

        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100">
          <header className="mb-6">
            <h2 className="text-sm font-black text-green-600 uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-8 h-[2px] bg-green-600"></span>
              Resultados de Cuadre
            </h2>
          </header>
          <CuadreDisplay reporteZRefreshKey={reporteZRefreshKey} />
        </div>
      </div>
    </div>
  );
}
