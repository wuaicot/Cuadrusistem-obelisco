import { useState, useEffect } from 'react';
import { fetchTurnos, type Turno } from '../../services/turnos.service';
import { fetchUnprocessedReportesZ, type ReporteZ } from '../../services/reportesZ.service';
import { fetchPlanillasByType, type Planilla } from '../../services/planillas.service';
import { TipoPlanilla } from '../../types/enums'; // Import TipoPlanilla from frontend types

export function CuadreDisplay() {
  const [fechaOperacion, setFechaOperacion] = useState('');
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [selectedTurnoId, setSelectedTurnoId] = useState('');
  const [reportesZ, setReportesZ] = useState<ReporteZ[]>([]);
  const [selectedReporteZId, setSelectedReporteZId] = useState('');
  const [planillasCocina, setPlanillasCocina] = useState<Planilla[]>([]);
  const [selectedPlanillaCocinaId, setSelectedPlanillaCocinaId] = useState('');
  const [planillasCaja, setPlanillasCaja] = useState<Planilla[]>([]);
  const [selectedPlanillaCajaId, setSelectedPlanillaCajaId] = useState('');
  const [cuadreData, setCuadreData] = useState<any | null>(null);

  // Loading and Error states
  const [isLoadingTurnos, setIsLoadingTurnos] = useState(true);
  const [errorTurnos, setErrorTurnos] = useState<string | null>(null);
  const [isLoadingReportesZ, setIsLoadingReportesZ] = useState(true);
  const [errorReportesZ, setErrorReportesZ] = useState<string | null>(null);
  const [isLoadingPlanillasCocina, setIsLoadingPlanillasCocina] = useState(true);
  const [errorPlanillasCocina, setErrorPlanillasCocina] = useState<string | null>(null);
  const [isLoadingPlanillasCaja, setIsLoadingPlanillasCaja] = useState(true);
  const [errorPlanillasCaja, setErrorPlanillasCaja] = useState<string | null>(null);
  const [isProcessingCuadre, setIsProcessingCuadre] = useState(false);
  const [cuadreError, setCuadreError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoadingTurnos(true);
        const turnosData = await fetchTurnos();
        setTurnos(turnosData);
        setErrorTurnos(null);
      } catch (error) {
        setErrorTurnos('Error al cargar los turnos.');
        console.error(error);
      } finally {
        setIsLoadingTurnos(false);
      }

      try {
        setIsLoadingReportesZ(true);
        const reportesData = await fetchUnprocessedReportesZ();
        setReportesZ(reportesData);
        setErrorReportesZ(null);
      } catch (error) {
        setErrorReportesZ('Error al cargar los reportes Z.');
        console.error(error);
      } finally {
        setIsLoadingReportesZ(false);
      }

      try {
        setIsLoadingPlanillasCocina(true);
        const planillasCocinaData = await fetchPlanillasByType(TipoPlanilla.COCINA);
        setPlanillasCocina(planillasCocinaData);
        setErrorPlanillasCocina(null);
      } catch (error) {
        setErrorPlanillasCocina('Error al cargar las planillas de cocina.');
        console.error(error);
      } finally {
        setIsLoadingPlanillasCocina(false);
      }

      try {
        setIsLoadingPlanillasCaja(true);
        const planillasCajaData = await fetchPlanillasByType(TipoPlanilla.CAJA);
        setPlanillasCaja(planillasCajaData);
        setErrorPlanillasCaja(null);
      } catch (error) {
        setErrorPlanillasCaja('Error al cargar las planillas de caja.');
        console.error(error);
      } finally {
        setIsLoadingPlanillasCaja(false);
      }
    };

    loadInitialData();
  }, []);

  const handleFetchCuadre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReporteZId || !selectedPlanillaCocinaId || !selectedPlanillaCajaId) {
      alert('Por favor, seleccione un Reporte Z, una Planilla de Cocina y una Planilla de Caja.');
      return;
    }
    // TODO: Implement API call to process cuadre data
    console.log({ selectedReporteZId, selectedPlanillaCocinaId, selectedPlanillaCajaId });
    // setCuadreData(mockCuadreDetalle); // Remove mock data usage
  };

  if (isLoadingTurnos || isLoadingReportesZ || isLoadingPlanillasCocina || isLoadingPlanillasCaja) {
    return <p className="text-center">Cargando datos necesarios...</p>;
  }

  if (errorTurnos) {
    return <p className="text-center text-red-500">{errorTurnos}</p>;
  }

  if (errorReportesZ) {
    return <p className="text-center text-red-500">{errorReportesZ}</p>;
  }

  if (errorPlanillasCocina) {
    return <p className="text-center text-red-500">{errorPlanillasCocina}</p>;
  }

  if (errorPlanillasCaja) {
    return <p className="text-center text-red-500">{errorPlanillasCaja}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-2xl font-bold mb-4">Visualizar Cuadre</h3>
      <form onSubmit={handleFetchCuadre} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Selection for Reporte Z */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reporteZ-select">
            Reporte Z
          </label>
          <select
            id="reporteZ-select"
            value={selectedReporteZId}
            onChange={(e) => setSelectedReporteZId(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={isProcessingCuadre}
          >
            <option value="">Seleccione Reporte Z</option>
            {reportesZ.map((reporte) => (
              <option key={reporte.id} value={reporte.id}>
                {reporte.fechaOperacion} - {reporte.local.nombre} - {reporte.turno.tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Selection for Planilla Cocina */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="planillaCocina-select">
            Planilla Cocina
          </label>
          <select
            id="planillaCocina-select"
            value={selectedPlanillaCocinaId}
            onChange={(e) => setSelectedPlanillaCocinaId(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={isProcessingCuadre}
          >
            <option value="">Seleccione Planilla Cocina</option>
            {planillasCocina.map((planilla) => (
              <option key={planilla.id} value={planilla.id}>
                {planilla.fecha} - {planilla.local.nombre} - {planilla.turno.tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Selection for Planilla Caja */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="planillaCaja-select">
            Planilla Caja
          </label>
          <select
            id="planillaCaja-select"
            value={selectedPlanillaCajaId}
            onChange={(e) => setSelectedPlanillaCajaId(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={isProcessingCuadre}
          >
            <option value="">Seleccione Planilla Caja</option>
            {planillasCaja.map((planilla) => (
              <option key={planilla.id} value={planilla.id}>
                {planilla.fecha} - {planilla.local.nombre} - {planilla.turno.tipo}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 lg:col-span-3 flex justify-end">
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
            disabled={isProcessingCuadre}
          >
            {isProcessingCuadre ? 'Procesando Cuadre...' : 'Procesar Cuadre'}
          </button>
        </div>
        {cuadreError && <div className="md:col-span-2 lg:col-span-3 mt-2 text-red-500">{cuadreError}</div>}
      </form>

      {cuadreData && cuadreData.detalle && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingrediente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo Teórico</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo Real</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diferencia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(cuadreData.detalle).map(([ingrediente, detalle]) => (
              <tr key={ingrediente}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ingrediente}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{detalle.teorico}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{detalle.real}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getDiferenciaClass(detalle.diferencia)}`}>
                  {detalle.diferencia}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
