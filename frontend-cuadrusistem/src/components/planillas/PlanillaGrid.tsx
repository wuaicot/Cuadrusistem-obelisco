import React, { useState, useEffect, useCallback } from "react";
import type { Role } from "../../store/useRoleStore";
import {
  fetchIngredientes,
  type IngredienteDef,
} from "../../services/ingredientes.service";
import { fetchLocales, type Local } from "../../services/locales.service";
import {
  createPlanilla,
  type CreatePlanillaPayload,
  type PlanillaItem,
} from "../../services/planillas.service";
import { fetchTurnos, type Turno } from "../../services/turnos.service";

// ============================================================================
// // Constants, Types, and Helpers
// ============================================================================
const SEGMENTOS = ["SALDO INICIAL", "ENTRADA", "DEVOLUC", "SALDO FINAL"];
const NUMEROS_UNIDADES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const NUMEROS_DECENAS = [10, 20, 30, 40, 50, 60, 70, 80, 90];
const NUMEROS_CENTENAS = [100];
const NUMEROS_PLANILLA = [
  ...NUMEROS_DECENAS,
  ...NUMEROS_CENTENAS,
  ...NUMEROS_UNIDADES,
];

const calculateTotal = (selectedNums: number[]): number =>
  selectedNums.reduce((sum, num) => sum + num, 0);

type SegmentoState = { selectedNumbers: number[]; total: number };
type TablaState = Record<string, SegmentoState>;
type PlanillasDataState = Record<string, TablaState>;

// ============================================================================
// // Sub-component: Tablilla (The clickable cell)
// ============================================================================
interface TablillaProps {
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}

function Tablilla({ isSelected, onClick, disabled }: TablillaProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`h-full w-full cursor-pointer transition-colors duration-150 ${
        isSelected ? "bg-black" : "bg-white"
      } ${
        !disabled && !isSelected ? "hover:bg-blue-100" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-200" : ""}`}
    />
  );
}

// ============================================================================
// // Sub-component: IngredienteTabla (The full grid for one ingredient)
// ============================================================================
interface IngredienteTablaProps {
  id: string;
  nombreVisible: string;
  isSaving: boolean;
  onStateChange: (ingredienteId: string, tablaState: TablaState) => void;
}

function IngredienteTabla({
  id,
  nombreVisible,
  isSaving,
  onStateChange,
}: IngredienteTablaProps) {
  const [tablaState, setTablaState] = useState<TablaState>({});

  useEffect(() => {
    onStateChange(id, tablaState);
  }, [tablaState, id, onStateChange]);

  const handleNumberToggle = (segmento: string, number: number) => {
    const segmentoKey = segmento.replace(" ", "_");
    setTablaState((prevState) => {
      const currentSegmentoState = prevState[segmentoKey] || {
        selectedNumbers: [],
        total: 0,
      };
      const currentSelected = currentSegmentoState.selectedNumbers;
      const newSelected = currentSelected.includes(number)
        ? currentSelected.filter((n) => n !== number)
        : [...currentSelected, number];
      const newTotal = calculateTotal(newSelected);
      return {
        ...prevState,
        [segmentoKey]: { selectedNumbers: newSelected, total: newTotal },
      };
    });
  };

  return (
    <div className="block bg-black border-l border-t border-black">
      <div className="grid grid-cols-planilla">
        {/* Row 1: Headers */}
        <div className="border-r border-b border-black bg-white"></div> {/* Top-left spacer */}
        <div className="border-r border-b border-black bg-white"></div> {/* Segment header spacer */}
        {NUMEROS_PLANILLA.map((num) => (
          <div
            key={num}
            className="h-8 sm:h-10 flex items-center justify-center border-r border-b border-black bg-white font-bold text-[10px] sm:text-sm p-1"
          >
            {num === 100 ? (
              <span className="text-xs -rotate-90 whitespace-nowrap">100</span>
            ) : (
              num
            )}
          </div>
        ))}

        {/* Data Rows */}
        <div className="row-span-4 flex items-center justify-center border-r border-b border-black bg-white font-bold text-center text-base sm:text-lg [writing-mode:vertical-lr] rotate-180">
          {nombreVisible}
        </div>

        {/* This creates the segment labels and all tablillas in a flat structure */}
        {SEGMENTOS.flatMap((segmento) => {
          const segmentoKey = segmento.replace(" ", "_");
          return [
          // Segment Label Cell
          <div
            key={segmento}
            className="h-14 sm:h-16 w-28 sm:w-40 flex flex-col items-center justify-center border-r border-b border-black bg-white text-center font-bold text-sm sm:text-base p-1"
          >
            <div>
              {segmento.split(" ").map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </div>
            <span className="mt-1 bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">
              {tablaState[segmentoKey]?.total || 0}
            </span>
          </div>,
          // 19 Tablilla cells for the current segment
          ...NUMEROS_PLANILLA.map((num) => (
            <div key={`${segmento}-${num}`} className="border-r border-b border-black bg-white">
              <Tablilla
                isSelected={
                  tablaState[segmentoKey]?.selectedNumbers.includes(
                    num
                  ) || false
                }
                onClick={() => handleNumberToggle(segmento, num)}
                disabled={isSaving}
              />
            </div>
          )),
        ]})}
      </div>
    </div>
  );
}


// ============================================================================
// // Main Component: PlanillaGrid (The page container)
// ============================================================================
interface PlanillaGridProps {
  tipo: Role;
}

export function PlanillaGrid({ tipo }: PlanillaGridProps) {
  const [planillasData, setPlanillasData] = useState<PlanillasDataState>({});
  const [ingredientes, setIngredientes] = useState<IngredienteDef[]>([]);
  const [fechaOperacion, setFechaOperacion] = useState(
    new Date().toISOString().split("T")[0],
  );
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
    if (tipo !== "COCINA" && tipo !== "CAJA") {
      setError("Tipo de planilla no válido o no seleccionado.");
      setIsLoading(false);
      return;
    }
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [ingredientesData, localesData, turnosData] = await Promise.all([
          fetchIngredientes(tipo),
          fetchLocales(),
          fetchTurnos(),
        ]);
        setIngredientes(ingredientesData);
        setLocales(localesData);
        setTurnos(turnosData);
        if (localesData.length > 0) setSelectedLocalId(localesData[0].id);
        if (turnosData.length > 0) setSelectedTurnoId(turnosData[0].id);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error desconocido.";
        setError(`No se pudieron cargar datos: ${msg}`);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [tipo]);

  const handleTablaStateChange = useCallback(
    (ingredienteId: string, tablaState: TablaState) => {
      setPlanillasData((prevData) => ({
        ...prevData,
        [ingredienteId]: tablaState,
      }));
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tipo !== "COCINA" && tipo !== "CAJA") {
      setSaveError("No se puede guardar una planilla con un tipo no válido.");
      return;
    }
    if (!fechaOperacion || !selectedTurnoId || !selectedLocalId) {
      setSaveError("Por favor, complete todos los campos: Fecha, Turno y Local.");
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    const items: PlanillaItem[] = Object.entries(planillasData)
      .flatMap(([ingredienteId, tablaState]) =>
        Object.entries(tablaState).map(([segmento, state]) => ({
          ingrediente: ingredienteId,
          segmento,
          cantidad: state.total,
        })),
      )
      .filter((item) => item.cantidad > 0);

    if (items.length === 0) {
      setSaveError("No hay datos para guardar. Llene al menos un valor.");
      setIsSaving(false);
      return;
    }

    const payload: CreatePlanillaPayload = {
      fecha: fechaOperacion,
      tipo: tipo, // Now safe because of the guard
      turnoId: selectedTurnoId,
      localId: selectedLocalId,
      items,
    };

    try {
      await createPlanilla(payload);
      setSaveSuccess("¡Planilla guardada exitosamente!");
      setPlanillasData({});
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido.";
      setSaveError(`Error al guardar: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) return <p className="p-4 text-center">Cargando...</p>;
  if (error) return <p className="p-4 text-center text-red-500">{error}</p>;
  
  // Guard against rendering if tipo is not valid (double check)
  if (tipo !== "COCINA" && tipo !== "CAJA") {
    return null; // or a more specific error component
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <header className="mb-4 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
          Planilla de {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
        </h1>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="p-4 mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
                <label className="block font-medium text-gray-700 mb-1" htmlFor="fechaPlanilla">Fecha</label>
                <input type="date" id="fechaPlanilla" value={fechaOperacion} onChange={(e) => setFechaOperacion(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" disabled={isSaving} required />
            </div>
            <div>
                <label className="block font-medium text-gray-700 mb-1" htmlFor="turnoPlanilla">Turno</label>
                <select id="turnoPlanilla" value={selectedTurnoId} onChange={(e) => setSelectedTurnoId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" disabled={isSaving || turnos.length === 0} required>
                    {turnos.length === 0 ? <option>Cargando...</option> : turnos.map(t => <option key={t.id} value={t.id}>{t.tipo} ({t.fecha})</option>)}
                </select>
            </div>
            <div>
                <label className="block font-medium text-gray-700 mb-1" htmlFor="localPlanilla">Local</label>
                <select id="localPlanilla" value={selectedLocalId} onChange={(e) => setSelectedLocalId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" disabled={isSaving || locales.length === 0} required>
                    {locales.length === 0 ? <option>Cargando...</option> : locales.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-6">
          {ingredientes.map((ing) => (
            <div key={ing.id} className="pb-2">
              <IngredienteTabla
                id={ing.id}
                nombreVisible={ing.nombreVisible}
                isSaving={isSaving}
                onStateChange={handleTablaStateChange}
              />
            </div>
          ))}
        </div>

        <footer className="mt-6">
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400" disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar Planilla"}
          </button>
          {saveSuccess && <div className="mt-3 p-3 text-sm bg-green-100 text-green-800 rounded-lg">{saveSuccess}</div>}
          {saveError && <div className="mt-3 p-3 text-sm bg-red-100 text-red-800 rounded-lg">{saveError}</div>}
        </footer>
      </form>
    </div>
  );
}
