import { useState, useEffect, useCallback } from "react";
import type { Role } from "../../store/useRoleStore";
import {
  fetchIngredientes,
  type IngredienteDef,
} from "../../services/ingredientes.service";
import { fetchLocales, type Local } from "../../services/locales.service";
import { createPlanilla } from "../../services/planillas.service";
import { fetchTurnos, type Turno } from "../../services/turnos.service";

const SEGMENTOS = ["SALDO_INICIAL", "ENTRADA", "DEVOLUC", "SALDO_FINAL"];

const NUMBERS = {
  unidades: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  decenas: [10, 20, 30, 40, 50, 60, 70, 80, 90],
  centenas: [100, 200, 300, 400, 500], // Extended for more flexibility
};

// ============================================================================
// // Sub-component: NumberButton
// ============================================================================
interface NumberButtonProps {
  number: number;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}

function NumberButton({
  number,
  isSelected,
  onClick,
  disabled,
}: NumberButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-10 h-10 rounded-md text-sm font-bold transition-all duration-150
        flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        ${
          isSelected
            ? "bg-gray-800 text-white shadow-inner"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {number}
    </button>
  );
}

// ============================================================================
// // Sub-component: NumberSelector
// ============================================================================
interface NumberSelectorProps {
  value: number;
  onChange: (newValue: number) => void;
  disabled: boolean;
}

function NumberSelector({ value, onChange, disabled }: NumberSelectorProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  useEffect(() => {
    // This effect synchronizes the internal state if the external value is reset
    if (value === 0) {
      setSelectedNumbers([]);
    }
  }, [value]);

  const handleNumberClick = (num: number) => {
    const newSelectedNumbers = selectedNumbers.includes(num)
      ? selectedNumbers.filter((n) => n !== num)
      : [...selectedNumbers, num];

    setSelectedNumbers(newSelectedNumbers);
    const newValue = newSelectedNumbers.reduce((sum, n) => sum + n, 0);
    onChange(newValue);
  };

  return (
    <div className="space-y-3 mt-2 p-3 bg-gray-50 rounded-lg">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Decenas
        </p>
        <div className="flex flex-wrap gap-2">
          {NUMBERS.decenas.map((num) => (
            <NumberButton
              key={num}
              number={num}
              isSelected={selectedNumbers.includes(num)}
              onClick={() => handleNumberClick(num)}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Unidades
        </p>
        <div className="flex flex-wrap gap-2">
          {NUMBERS.unidades.map((num) => (
            <NumberButton
              key={num}
              number={num}
              isSelected={selectedNumbers.includes(num)}
              onClick={() => handleNumberClick(num)}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
       <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Centenas
        </p>
        <div className="flex flex-wrap gap-2">
          {NUMBERS.centenas.map((num) => (
            <NumberButton
              key={num}
              number={num}
              isSelected={selectedNumbers.includes(num)}
              onClick={() => handleNumberClick(num)}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// // Sub-component: IngredienteCard
// ============================================================================
type PlanillaRowData = Record<string, number>;

interface IngredienteCardProps {
  ingrediente: IngredienteDef;
  data: PlanillaRowData;
  onDataChange: (segmento: string, value: number) => void;
  isSaving: boolean;
}

function IngredienteCard({
  ingrediente,
  data,
  onDataChange,
  isSaving,
}: IngredienteCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 duration-200">
      <h4 className="bg-slate-700 text-white text-lg font-bold p-4 truncate">
        {ingrediente.nombreVisible}
      </h4>
      <div className="p-4 sm:p-5 space-y-5">
        {SEGMENTOS.map((segmento) => (
          <div key={segmento}>
            <label className="flex justify-between items-center text-sm font-bold text-gray-600 uppercase">
              <span>{segmento.replace("_", " ")}</span>
              <span className="text-indigo-600 font-black text-lg px-2 py-1 bg-indigo-50 rounded-md">
                {data[segmento] || 0}
              </span>
            </label>
            <NumberSelector
              value={data[segmento] || 0}
              onChange={(newValue) => onDataChange(segmento, newValue)}
              disabled={isSaving}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// // Main Component: PlanillaGrid
// ============================================================================
type PlanillaData = Record<string, PlanillaRowData>;

interface PlanillaGridProps {
  tipo: Role; // Tipo de planilla (e.g., COCINA, CAJA)
}

export function PlanillaGrid({ tipo }: PlanillaGridProps) {
  const [data, setData] = useState<PlanillaData>({});
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

  const handleDataChange = useCallback(
    (codigo: string, segmento: string, value: number) => {
      setData((prevData) => ({
        ...prevData,
        [codigo]: {
          ...prevData[codigo],
          [segmento]: value,
        },
      }));
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

    const items = Object.entries(data).flatMap(([ingredienteCodigo, segmentos]) => {
      return Object.entries(segmentos).map(([segmento, cantidad]) => ({
          ingrediente: ingredienteCodigo,
          // This needs to be clarified based on business logic.
          // For now, sending all segments. Backend should know how to process them.
          segmento: segmento,
          cantidad: cantidad,
      })).filter(item => item.cantidad > 0);
    });

    const createPlanillaDto = {
      fecha: fechaOperacion,
      tipo: tipo === "COCINA" ? "COCINA" : "CAJA",
      turnoId: selectedTurnoId,
      localId: selectedLocalId,
      items: items, // This structure might need backend adjustment
    };

    try {
      await createPlanilla(createPlanillaDto);
      setSaveSuccess(`¡Planilla de ${tipo} guardada exitosamente!`);
      setData({});
      // setFechaOperacion(""); // Keep date for potentially submitting another form
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h3 className="text-3xl font-bold text-gray-900">Planilla de {tipo}</h3>
        <p className="text-sm text-gray-500 mt-1">Llene los datos de inventario para cada ingrediente.</p>
      </header>
      
      <form onSubmit={handleSubmit}>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-8">
          {ingredientes.map((ingrediente) => (
            <IngredienteCard
              key={ingrediente.codigo}
              ingrediente={ingrediente}
              data={data[ingrediente.codigo] || {}}
              onDataChange={(segmento, value) =>
                handleDataChange(ingrediente.codigo, segmento, value)
              }
              isSaving={isSaving}
            />
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
