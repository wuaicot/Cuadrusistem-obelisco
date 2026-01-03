import { useState, useEffect, useCallback, useMemo } from "react";
import type { Role } from "../../store/useRoleStore";
import {
  fetchIngredientes,
  type IngredienteDef,
} from "../../services/ingredientes.service";
import { fetchLocales, type Local } from "../../services/locales.service";
import type { PlanillaItem } from "../../services/planillas.service"; // Ensure PlanillaItem is imported
import { createPlanilla } from "../../services/planillas.service";
import { fetchTurnos, type Turno } from "../../services/turnos.service";

const SEGMENTOS = ["SALDO_INICIAL", "ENTRADA", "DEVOLUC", "SALDO_FINAL"];

const NUMEROS_UNIDADES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const NUMEROS_DECENAS = [10, 20, 30, 40, 50, 60, 70, 80, 90];
const NUMEROS_CENTENAS = [100]; // As per image, only 100 shown

// Combine all number categories into a single flat array for column headers
const NUMEROS_PLANILLA = [
  ...NUMEROS_DECENAS,
  ...NUMEROS_CENTENAS,
  ...NUMEROS_UNIDADES,
];

// Helper to get total from selected numbers
const calculateTotal = (selectedNums: number[]): number =>
  selectedNums.reduce((sum, num) => sum + num, 0);

// ============================================================================
// // Sub-component: NumberGridCell (formerly NumberButton logic)
// ============================================================================
interface NumberGridCellProps {
  number: number;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}

function NumberGridCell({
  number,
  isSelected,
  onClick,
  disabled,
}: NumberGridCellProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        flex items-center justify-center p-0.5 border border-gray-300 text-xs font-medium cursor-pointer select-none
        ${isSelected ? "bg-gray-800 text-white" : "bg-white text-gray-800 hover:bg-gray-100"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      style={{ minWidth: '24px', height: '24px' }} // Fixed size for compactness
    >
      {/* Optionally display number in cell for debugging/clarity, but image shows empty on white */}
    </div>
  );
}

// ============================================================================
// // Main Component: PlanillaGrid
// ============================================================================
type PlanillaRowState = {
  [segmento: string]: {
    selectedNumbers: number[];
    total: number;
  };
};

type PlanillaDataState = {
  [ingredienteCodigo: string]: PlanillaRowState;
};

interface PlanillaGridProps {
  tipo: Role; // Tipo de planilla (e.g., COCINA, CAJA)
}

export function PlanillaGrid({ tipo }: PlanillaGridProps) {
  const [data, setData] = useState<PlanillaDataState>({});
  const [ingredientes, setIngredientes] = useState<IngredienteDef[]>([]);
  const [fechaOperacion, setFechaOperacion] = useState("");
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [selectedTurnoId, setSelectedTurnoId] = useState("");
  const [locales, setLocales] = useState<Local[]>([]);
  const [selectedLocalId, setSelectedLocalId] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [ingredientesData, localesData, turnosData] = await Promise.all([
          fetchIngredientes(),
          fetchLocales(),
          fetchTurnos(),
        ]);

        setIngredientes(ingredientesData);
        setLocales(localesData);
        setTurnos(turnosData);

        if (localesData.length > 0) setSelectedLocalId(localesData[0].id);
        if (turnosData.length > 0) setSelectedTurnoId(turnosData[0].id);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos necesarios para la planilla.");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleNumberToggle = useCallback(
    (ingredienteCodigo: string, segmento: string, number: number) => {
      setData((prevData) => {
        const currentSelected =
          prevData[ingredienteCodigo]?.[segmento]?.selectedNumbers || [];
        const newSelected = currentSelected.includes(number)
          ? currentSelected.filter((n) => n !== number)
          : [...currentSelected, number];
        const newTotal = calculateTotal(newSelected);

        return {
          ...prevData,
          [ingredienteCodigo]: {
            ...prevData[ingredienteCodigo],
            [segmento]: {
              selectedNumbers: newSelected,
              total: newTotal,
            },
          },
        };
      });
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaOperacion || !selectedTurnoId || !selectedLocalId) {
      setSaveError("Por favor, complete todos los campos: Fecha, Turno y Local.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    const items: PlanillaItem[] = [];
    for (const ingredienteCodigo in data) {
      for (const segmento in data[ingredienteCodigo]) {
        if (data[ingredienteCodigo][segmento].total > 0) {
          items.push({
            ingrediente: ingredienteCodigo,
            segmento: segmento,
            cantidad: data[ingredienteCodigo][segmento].total,
          });
        }
      }
    }

    const createPlanillaDto = {
      fecha: fechaOperacion,
      tipo: tipo === "COCINA" ? "COCINA" : "CAJA",
      turnoId: selectedTurnoId,
      localId: selectedLocalId,
      items: items,
    };

    try {
      await createPlanilla(createPlanillaDto);
      setSaveSuccess(`¡Planilla de ${tipo} guardada exitosamente!`);
      setData({}); // Reset grid data after successful submission
      // setFechaOperacion(""); // Optionally reset date field
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido.";
      setSaveError(`Error al guardar: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p className="text-center p-10">Cargando datos necesarios...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 p-10">{error}</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8"> {/* Adjusted max-w */}
        <header className="mb-8">
          <h3 className="text-3xl font-bold text-gray-900">Planilla de {tipo}</h3>
          <p className="text-sm text-gray-500 mt-1">Llene los datos de inventario para cada ingrediente tocando los números.</p>
        </header>
        
        <form onSubmit={handleSubmit}>
          {/* Metadata form (Fecha, Turno, Local) */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fechaPlanilla">
                  Fecha de Operación
                </label>
                <input
                  type="date"
                  id="fechaPlanilla"
                  value={fechaOperacion}
                  onChange={(e) => setFechaOperacion(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="turnoPlanilla">
                  Turno
                </label>
                <select
                  id="turnoPlanilla"
                  value={selectedTurnoId}
                  onChange={(e) => setSelectedTurnoId(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  disabled={isSaving}
                >
                  {turnos.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.tipo} ({t.fecha})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="localPlanilla">
                  Local
                </label>
                <select
                  id="localPlanilla"
                  value={selectedLocalId}
                  onChange={(e) => setSelectedLocalId(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  disabled={isSaving}
                >
                  {locales.map((l) => (
                    <option key={l.id} value={l.id}>{l.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Ingredient Planilla Grids */}
          <div className="space-y-8">
            {ingredientes.map((ingrediente) => (
              <div key={ingrediente.codigo} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-300">
                <div className="grid grid-cols-[auto_minmax(100px,auto)_repeat(19,_1fr)] auto-rows-min">
                  {/* Top-Left Corner & Number Headers */}
                  <div className="col-span-2 border-b border-gray-300 bg-gray-50"></div> {/* Empty space */}
                  {NUMEROS_PLANILLA.map((num, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-center p-0.5 border-l border-b border-gray-300 bg-gray-50 text-xs font-bold text-gray-700"
                      style={{ minWidth: '24px', height: '24px', writingMode: num === 100 ? 'vertical-lr' : undefined }}
                    >
                      {num}
                    </div>
                  ))}
                  
                  {/* Ingredient Name (Rotated) & Segments */}
                  <div 
                    className="row-span-4 flex items-center justify-center border-r border-gray-300 text-center text-sm font-bold bg-gray-50 text-gray-700"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', minWidth: '40px' }}
                  >
                    {ingrediente.nombreVisible}
                  </div>

                  {SEGMENTOS.map((segmento, segIndex) => (
                    <>
                      {/* Segment Name */}
                      <div 
                        key={`${ingrediente.codigo}-${segmento}-label`}
                        className={`col-start-2 flex items-center justify-start p-1 border-r border-gray-300 text-xs font-bold text-gray-800 bg-gray-50 ${segIndex < SEGMENTOS.length -1 ? 'border-b' : ''}`}
                      >
                        {segmento.replace('_', ' ')}
                        <span className="ml-auto text-indigo-600 font-black px-1">
                            {data[ingrediente.codigo]?.[segmento]?.total || 0}
                        </span>
                      </div>
                      
                      {/* Number Grid Cells */}
                      {NUMEROS_PLANILLA.map((num) => (
                        <NumberGridCell
                          key={`${ingrediente.codigo}-${segmento}-${num}`}
                          number={num}
                          isSelected={
                            data[ingrediente.codigo]?.[segmento]?.selectedNumbers?.includes(num) || false
                          }
                          onClick={() => handleNumberToggle(ingrediente.codigo, segmento, num)}
                          disabled={isSaving}
                        />
                      ))}
                    </>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <footer className="mt-8">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              disabled={isSaving}
            >
              {isSaving ? "Guardando..." : "Guardar Planilla"}
            </button>
            {saveSuccess && (
              <div className="mt-4 p-4 text-sm bg-green-50 text-green-800 border border-green-200 rounded-lg">
                {saveSuccess}
              </div>
            )}
            {saveError && (
              <div className="mt-4 p-4 text-sm bg-red-50 text-red-800 border border-red-200 rounded-lg">
                {saveError}
              </div>
            )}
          </footer>
        </form>
      </div>
    </div>
  );
}
