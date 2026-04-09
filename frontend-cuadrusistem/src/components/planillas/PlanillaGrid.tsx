import React, { useState, useEffect, useCallback } from "react";
import type { Role } from "../../store/useRoleStore";
import {
  fetchIngredientes,
  type IngredienteDef,
} from "../../services/ingredientes.service";
import { fetchLocales, type Local } from "../../services/locales.service";
import {
  createPlanilla,
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
      className={`h-full w-full cursor-pointer transition-all duration-150 active:scale-90 ${
        isSelected ? "bg-[#000033] shadow-inner" : "bg-white"
      } ${
        !disabled && !isSelected ? "hover:bg-blue-50" : ""
      } ${disabled ? "opacity-30 cursor-not-allowed bg-gray-100" : ""}`}
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
    <div className="bg-black p-[1px] rounded-lg overflow-hidden shadow-md fade-in max-w-full">
      {/* Contenedor con scroll interno solo si es necesario, pero intentando ajustar */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="grid grid-cols-planilla min-w-[320px] sm:min-w-full">
          {/* Row 1: Headers */}
          <div className="border-r border-b border-black bg-gray-50"></div>{" "}
          {/* Top-left spacer */}
          <div className="border-r border-b border-black bg-gray-50"></div>{" "}
          {/* Segment header spacer */}
          {NUMEROS_PLANILLA.map((num) => (
            <div
              key={num}
              className="h-8 sm:h-10 flex items-center justify-center border-r border-b border-black bg-gray-100 font-bold text-[9px] sm:text-xs text-gray-700"
            >
              {num === 100 ? (
                <span className="text-[10px] -rotate-90">100</span>
              ) : (
                num
              )}
            </div>
          ))}
          
          {/* Row 2-5: Ingredient Name (Vertical) and Data Rows */}
          <div className="row-span-4 flex items-center justify-center border-r border-b border-black bg-white font-black text-center text-xs sm:text-sm uppercase tracking-tighter [writing-mode:vertical-lr] rotate-180 py-2">
            {nombreVisible}
          </div>

          {SEGMENTOS.flatMap((segmento) => {
            const segmentoKey = segmento.replace(" ", "_");
            return [
              // Segment Label Cell
              <div
                key={segmento}
                className="h-12 sm:h-14 min-w-[5.5rem] sm:min-w-[7rem] flex flex-col items-center justify-center border-r border-b border-black bg-gray-50 text-center font-bold text-[10px] sm:text-xs p-1 leading-tight"
              >
                <div className="text-gray-600">
                  {segmento.split(" ").map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </div>
                <span className={`mt-1 text-[10px] font-black px-2 rounded-sm ${tablaState[segmentoKey]?.total ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {tablaState[segmentoKey]?.total || 0}
                </span>
              </div>,
              // 19 Tablilla cells for the current segment
              ...NUMEROS_PLANILLA.map((num) => (
                <div
                  key={`${segmento}-${num}`}
                  className="border-r border-b border-black bg-white h-12 sm:h-14"
                >
                  <Tablilla
                    isSelected={
                      tablaState[segmentoKey]?.selectedNumbers.includes(num) ||
                      false
                    }
                    onClick={() => handleNumberToggle(segmento, num)}
                    disabled={isSaving}
                  />
                </div>
              )),
            ];
          })}
        </div>
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
  const [, setError] = useState<string | null>(null);
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

        const safeIngredientes = Array.isArray(ingredientesData) ? ingredientesData : [];
        const safeLocales = Array.isArray(localesData) ? localesData : [];
        const safeTurnos = Array.isArray(turnosData) ? turnosData : [];

        setIngredientes(safeIngredientes);
        setLocales(safeLocales);
        setTurnos(safeTurnos);

        if (safeLocales.length > 0) setSelectedLocalId(safeLocales[0].id);
        if (safeTurnos.length > 0) setSelectedTurnoId(safeTurnos[0].id);
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
    if (tipo !== "COCINA" && tipo !== "CAJA") return;
    if (!fechaOperacion || !selectedTurnoId || !selectedLocalId) {
      setSaveError("Complete Fecha, Turno y Local.");
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
      setSaveError("Ingrese al menos un valor.");
      setIsSaving(false);
      return;
    }

    try {
      await createPlanilla({
        fecha: fechaOperacion,
        tipo,
        turnoId: selectedTurnoId,
        localId: selectedLocalId,
        items,
      });
      setSaveSuccess("¡Guardado correctamente!");
      setPlanillasData({});
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSaveError("Error al guardar planilla.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-gray-500 font-medium">Cargando ingredientes...</p>
    </div>
  );

  return (
    <div className="max-w-full overflow-x-hidden pb-20 px-2 sm:px-4">
      <form onSubmit={handleSubmit} className="fade-in">
        <div className="sticky top-0 z-30 py-4 bg-gray-50/95 backdrop-blur-sm">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label htmlFor="fecha-input" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fecha</label>
              <input
                id="fecha-input"
                type="date"
                value={fechaOperacion}
                onChange={(e) => setFechaOperacion(e.target.value)}
                className="w-full p-2 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="turno-select" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Turno</label>
              <select
                id="turno-select"
                value={selectedTurnoId}
                onChange={(e) => setSelectedTurnoId(e.target.value)}
                className="w-full p-2 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                required
              >
                {turnos.map((t) => (
                  <option key={t.id} value={t.id}>{t.tipo}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="local-select" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Local</label>
              <select
                id="local-select"
                value={selectedLocalId}
                onChange={(e) => setSelectedLocalId(e.target.value)}
                className="w-full p-2 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                required
              >
                {locales.map((l) => (
                  <option key={l.id} value={l.id}>{l.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6 mt-4">
          {ingredientes.map((ing) => (
            <IngredienteTabla
              key={ing.id}
              id={ing.id}
              nombreVisible={ing.nombreVisible}
              isSaving={isSaving}
              onStateChange={handleTablaStateChange}
            />
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent z-40">
          <div className="max-w-4xl mx-auto">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm"
            >
              {isSaving ? "Guardando..." : "Finalizar y Guardar"}
            </button>
            
            {saveSuccess && (
              <div className="absolute bottom-20 left-4 right-4 animate-bounce p-3 bg-green-500 text-white text-center rounded-xl font-bold shadow-lg">
                {saveSuccess}
              </div>
            )}
            {saveError && (
              <div className="absolute bottom-20 left-4 right-4 p-3 bg-red-500 text-white text-center rounded-xl font-bold shadow-lg">
                {saveError}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
