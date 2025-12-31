import { useState, useEffect } from 'react';
import type { Role } from '../../store/useRoleStore';
import {
  fetchIngredientes,
  type IngredienteDef,
} from '../../services/ingredientes.service';
import { fetchLocales, type Local } from '../../services/locales.service';
import { createPlanilla } from '../../services/planillas.service'; // Import createPlanilla
import { fetchTurnos, type Turno } from '../../services/turnos.service'; // Import fetchTurnos and Turno type

const SEGMENTOS = ['SALDO_INICIAL', 'ENTRADA', 'DEVOLUC', 'SALDO_FINAL'];
// const turnoTipos = ['TURNO_I', 'TURNO_II']; // No longer needed, will use fetched turnos

type PlanillaData = Record<string, Record<string, number>>;

interface PlanillaGridProps {
  tipo: Role; // Tipo de planilla (e.g., COCINA, CAJA)
}

export function PlanillaGrid({ tipo }: PlanillaGridProps) {
  // State for grid data
  const [data, setData] = useState<PlanillaData>({});
  const [ingredientes, setIngredientes] = useState<IngredienteDef[]>([]);

  // State for form fields
  const [fechaOperacion, setFechaOperacion] = useState('');
  // const [turno, setTurno] = useState(turnoTipos[0]); // No longer needed
  const [turnos, setTurnos] = useState<Turno[]>([]); // New state for fetched turnos
  const [selectedTurnoId, setSelectedTurnoId] = useState(''); // New state for selected turno ID
  const [locales, setLocales] = useState<Local[]>([]);
  const [selectedLocalId, setSelectedLocalId] = useState('');

  // State for UI feedback (ingredients)
  const [isLoadingIngredientes, setIsLoadingIngredientes] = useState(true);
  const [errorIngredientes, setErrorIngredientes] = useState<string | null>(null);

  // State for UI feedback (locales)
  const [isLoadingLocales, setIsLoadingLocales] = useState(true);
  const [errorLocales, setErrorLocales] = useState<string | null>(null);

  // State for UI feedback (turnos)
  const [isLoadingTurnos, setIsLoadingTurnos] = useState(true); // New state for loading turnos
  const [errorTurnos, setErrorTurnos] = useState<string | null>(null); // New state for turno errors

  // State for UI feedback (saving planilla)
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Effect to load ingredients
  useEffect(() => {
    const loadIngredientes = async () => {
      try {
        setIsLoadingIngredientes(true);
        const fetchedIngredientes = await fetchIngredientes();
        setIngredientes(fetchedIngredientes);
      } catch (err) {
        setErrorIngredientes('No se pudo cargar la lista de ingredientes.');
        console.error(err);
      } finally {
        setIsLoadingIngredientes(false);
      }
    };
    loadIngredientes();
  }, []);

  // Effect to load locales
  useEffect(() => {
    const getLocales = async () => {
      try {
        setIsLoadingLocales(true);
        const data = await fetchLocales();
        setLocales(data);
        if (data.length > 0) {
          setSelectedLocalId(data[0].id); // Select the first locale by default
        }
      } catch (error) {
        console.error('Error fetching locales:', error);
        setErrorLocales('No se pudieron cargar los locales.');
      } finally {
        setIsLoadingLocales(false);
      }
    };
    getLocales();
  }, []);

  // Effect to load turnos
  useEffect(() => {
    const getTurnos = async () => {
      try {
        setIsLoadingTurnos(true);
        const data = await fetchTurnos();
        setTurnos(data);
        if (data.length > 0) {
          setSelectedTurnoId(data[0].id); // Select the first turno by default
        }
      } catch (error) {
        console.error('Error fetching turnos:', error);
        setErrorTurnos('No se pudieron cargar los turnos.');
      } finally {
        setIsLoadingTurnos(false);
      }
    };
    getTurnos();
  }, []);

  const handleCellChange = (
    codigo: string,
    segmento: string,
    value: string
  ) => {
    const numericValue = parseInt(value, 10);
    setData((prevData) => ({
      ...prevData,
      [codigo]: {
        ...prevData[codigo],
        [segmento]: isNaN(numericValue) ? 0 : numericValue,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaOperacion || !selectedTurnoId || !selectedLocalId) {
      alert('Por favor, complete todos los campos de la planilla (Fecha, Turno, Local).');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    // Transform grid data into items array for backend
    const items = ingredientes
      .map((ingrediente) => {
        const entrada = data[ingrediente.codigo]?.ENTRADA || 0;
        // Assuming 'cantidad' for the backend is simply 'ENTRADA' for now.
        // This might need adjustment based on final business logic for net consumption.
        return {
          ingrediente: ingrediente.codigo,
          cantidad: entrada,
        };
      })
      .filter(item => item.cantidad > 0); // Only send items with quantity > 0

    const createPlanillaDto = {
      fecha: fechaOperacion,
      tipo: tipo === 'COCINA' ? 'COCINA' : 'CAJA', // Map Role to TipoPlanilla enum
      turnoId: selectedTurnoId, // Use selectedTurnoId
      localId: selectedLocalId,
      items: items,
    };

    try {
      const response = await createPlanilla(createPlanillaDto); // Use createPlanilla from service
      // The service function already returns the created planilla, so we don't need to check response.status
      setSaveSuccess(`¡Planilla de ${tipo} guardada exitosamente!`);
      // Optionally reset form/grid data
      setData({});
      setFechaOperacion(''); // Clear date field
    } catch (err: any) {
      console.error('Error saving planilla:', err);
      const message = err.response?.data?.message || 'Error desconocido al guardar la planilla.';
      setSaveError(`Error: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingIngredientes || isLoadingLocales || isLoadingTurnos) { // Include isLoadingTurnos
    return <p className="text-center">Cargando datos necesarios...</p>;
  }

  if (errorIngredientes) {
    return <p className="text-center text-red-500">{errorIngredientes}</p>;
  }

  if (errorLocales) {
    return <p className="text-center text-red-500">{errorLocales}</p>;
  }

  if (errorTurnos) { // Handle errorTurnos
    return <p className="text-center text-red-500">{errorTurnos}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold mb-4">Planilla de {tipo}</h3>
      <form onSubmit={handleSubmit}>
        {/* New form fields for Planilla metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fechaPlanilla">
              Fecha de Operación
            </label>
            <input
              type="date"
              id="fechaPlanilla"
              value={fechaOperacion}
              onChange={(e) => setFechaOperacion(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="turnoPlanilla">
              Turno
            </label>
            <select
              id="turnoPlanilla"
              value={selectedTurnoId}
              onChange={(e) => setSelectedTurnoId(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={isSaving}
            >
              {turnos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.tipo} ({t.fecha}) {/* Display turno tipo and date for clarity */}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="localPlanilla">
              Local
            </label>
            <select
              id="localPlanilla"
              value={selectedLocalId}
              onChange={(e) => setSelectedLocalId(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={isSaving}
            >
              {locales.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingrediente
                </th>
                {SEGMENTOS.map((segmento) => (
                  <th
                    key={segmento}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {segmento.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ingredientes.map((ingrediente) => (
                <tr key={ingrediente.codigo}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ingrediente.nombreVisible}
                  </td>
                  {SEGMENTOS.map((segmento) => (
                    <td key={segmento} className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        title={`${ingrediente.nombreVisible} - ${segmento.replace(
                          '_',
                          ' '
                        )}`}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={data[ingrediente.codigo]?.[segmento] || ''}
                        onChange={(e) =>
                          handleCellChange(
                            ingrediente.codigo,
                            segmento,
                            e.target.value
                          )
                        }
                        disabled={isSaving}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar Planilla'}
          </button>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 border border-green-300 rounded">
            {saveSuccess}
          </div>
        )}
        {saveError && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 border border-red-300 rounded">
            {saveError}
          </div>
        )}
      </form>
    </div>
  );
}
