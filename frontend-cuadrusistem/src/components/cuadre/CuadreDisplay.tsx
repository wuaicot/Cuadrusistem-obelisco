import { useState, useEffect } from 'react';
import { fetchUnprocessedReportesZ, type ReporteZ } from '../../services/reportesZ.service';
import { fetchPlanillasByType, type Planilla } from '../../services/planillas.service';
import { processCuadre, type CuadreResult } from '../../services/cuadre.service';

// Helper function to determine the class for the 'diferencia' cell
function getDiferenciaClass(diferencia: number): string {
  if (diferencia < 0) return 'text-red-600 font-bold';
  if (diferencia > 0) return 'text-blue-600 font-bold';
  return 'text-gray-500';
}

// Type for the details of each ingredient in the cuadre
type CuadreDetalle = {
  teorico: number;
  real: number;
  diferencia: number;
};

interface CuadreDisplayProps {
  reporteZRefreshKey: number;
}

export function CuadreDisplay({ reporteZRefreshKey }: CuadreDisplayProps) {
  // State for selections
  const [selectedReporteZId, setSelectedReporteZId] = useState('');
  const [selectedPlanillaCocinaId, setSelectedPlanillaCocinaId] = useState('');
  const [selectedPlanillaCajaId, setSelectedPlanillaCajaId] = useState('');

  // State for data fetched from API
  const [reportesZ, setReportesZ] = useState<ReporteZ[]>([]);
  const [planillasCocina, setPlanillasCocina] = useState<Planilla[]>([]);
  const [planillasCaja, setPlanillasCaja] = useState<Planilla[]>([]);
  
  // State for the result of the cuadre processing
  const [cuadreData, setCuadreData] = useState<CuadreResult | null>(null);

  // Consolidated loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);


  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all data in parallel
        const [
          reportesData,
          planillasCocinaData,
          planillasCajaData,
        ] = await Promise.all([
          fetchUnprocessedReportesZ(),
          fetchPlanillasByType('COCINA'),
          fetchPlanillasByType('CAJA'),
        ]);

        setReportesZ(reportesData);
        setPlanillasCocina(planillasCocinaData);
        setPlanillasCaja(planillasCajaData);

      } catch (err) {
        console.error("Error loading initial data for cuadre:", err);
        setError('Error al cargar los datos necesarios para el cuadre. Revise la consola y el estado del backend.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [reporteZRefreshKey]);

  const handleProcessCuadre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReporteZId || !selectedPlanillaCocinaId || !selectedPlanillaCajaId) {
      setError('Por favor, seleccione un Reporte Z, una Planilla de Cocina y una Planilla de Caja.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCuadreData(null);

    try {
      const result = await processCuadre({
        reporteZId: selectedReporteZId,
        planillaCocinaId: selectedPlanillaCocinaId,
        planillaCajaId: selectedPlanillaCajaId,
      });
      setCuadreData(result);
    } catch (err) {
      console.error("Error processing cuadre:", err);
      const message = err instanceof Error ? err.message : "Ocurrió un error desconocido.";
      setError(`Error al procesar el cuadre: ${message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <p className="text-center p-4">Cargando datos necesarios...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-2xl font-bold mb-4">Procesar y Visualizar Cuadre</h3>
      <form onSubmit={handleProcessCuadre} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-end">
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reporteZ-select">
            Reporte Z
          </label>
          <select
            id="reporteZ-select"
            value={selectedReporteZId}
            onChange={(e) => setSelectedReporteZId(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-red-500"
            disabled={isProcessing}
            required
          >
            <option value="">Seleccione Reporte Z</option>
            {reportesZ.map((reporte) => (
              <option key={reporte.id} value={reporte.id}>
                {new Date(reporte.fechaOperacion).toLocaleDateString()} - {reporte.turno_tipo} - {reporte.local_nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="planillaCocina-select">
            Planilla Cocina
          </label>
          <select
            id="planillaCocina-select"
            value={selectedPlanillaCocinaId}
            onChange={(e) => setSelectedPlanillaCocinaId(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={isProcessing}
            required
          >
            <option value="">Seleccione Planilla Cocina</option>
            {planillasCocina.map((planilla) => (
              <option key={planilla.id} value={planilla.id}>
                {new Date(planilla.fecha).toLocaleDateString()} - {planilla.turno_tipo} - {planilla.local_nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="planillaCaja-select">
            Planilla Caja
          </label>
          <select
            id="planillaCaja-select"
            value={selectedPlanillaCajaId}
            onChange={(e) => setSelectedPlanillaCajaId(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={isProcessing}
            required
          >
            <option value="">Seleccione Planilla Caja</option>
            {planillasCaja.map((planilla) => (
              <option key={planilla.id} value={planilla.id}>
                {new Date(planilla.fecha).toLocaleDateString()} - {planilla.turno_tipo} - {planilla.local_nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 w-full"
            disabled={isProcessing}
          >
            {isProcessing ? 'Procesando...' : 'Procesar Cuadre'}
          </button>
        </div>
      </form>

      {error && <div className="my-4 text-red-600 bg-red-100 border border-red-300 p-3 rounded">{error}</div>}

      {isProcessing && <p className="text-center p-4">Procesando cuadre, por favor espere...</p>}

      {cuadreData && cuadreData.detalle && (
        <table className="min-w-full divide-y divide-gray-200 mt-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingrediente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo Z</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo Planilla</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diferencia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(cuadreData.detalle).map(([ingrediente, detalle]: [string, CuadreDetalle]) => (
              <tr key={ingrediente}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ingrediente}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{detalle.teorico}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{detalle.real}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getDiferenciaClass(detalle.diferencia)}`}>
                  {detalle.diferencia}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getDiferenciaClass(detalle.diferencia)}`}>
                  {detalle.diferencia < 0 ? 'FALTANTE' : (detalle.diferencia > 0 ? 'SOBRANTE' : 'OK')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
