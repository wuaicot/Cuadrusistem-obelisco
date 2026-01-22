import React, { useState, useEffect, useCallback } from "react";
import type { Role } from "../../store/useRoleStore";
import {
  fetchIngredientes,
  type IngredienteDef,
} from "../../services/ingredientes.service";
import { fetchLocales, type Local } from "../../services/locales.service";
import { createPlanilla, type PlanillaItem } from "../../services/planillas.service";
import { fetchTurnos, type Turno } from "../../services/turnos.service";

// ============================================================================
// // Constants & Helpers
// ============================================================================
const SEGMENTOS = ["SALDO_INICIAL", "ENTRADA", "DEVOLUC", "SALDO_FINAL"];
const NUMEROS_UNIDADES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const NUMEROS_DECENAS = [10, 20, 30, 40, 50, 60, 70, 80, 90];
const NUMEROS_CENTENAS = [100];
const NUMEROS_PLANILLA = [...NUMEROS_DECENAS, ...NUMEROS_CENTENAS, ...NUMEROS_UNIDADES];
const calculateTotal = (selectedNums: number[]): number => selectedNums.reduce((sum, num) => sum + num, 0);

// ============================================================================
// // Type Definitions
// ============================================================================
type SegmentoState = { selectedNumbers: number[]; total: number; };
type TablaState = Record<string, SegmentoState>; // State for one ingredient's 'Tabla'
type PlanillasDataState = Record<string, TablaState>; // State for all 'Tablas' in the 'Planilla'

// ============================================================================
// // Sub-component: Tablilla (Grid Cell)
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
      className={`
        w-full h-7 flex items-center justify-center border-b border-r border-gray-300 text-[10px] font-medium cursor-pointer select-none
        transition-colors duration-150
        ${isSelected
          ? "bg-[oklch(28.2%_0.091_267.935)] text-white"
          : "bg-white hover:bg-blue-100 border-gray-300" // Adjusted border color here for consistency
        }
        ${disabled ? "bg-gray-200 opacity-50 cursor-not-allowed" : ""}
      `}
    />
  );
}

// ============================================================================
// // Sub-component: IngredienteTabla (Independent Ingredient Grid)
// ============================================================================
interface IngredienteTablaProps {
  id: string;
  nombreVisible: string;
  isSaving: boolean;
  onStateChange: (ingredienteId: string, tablaState: TablaState) => void;
}

function IngredienteTabla({ id, nombreVisible, isSaving, onStateChange }: IngredienteTablaProps) {
  const [tablaState, setTablaState] = useState<TablaState>({});

  // Use useEffect to inform parent when internal tablaState changes
  useEffect(() => {
    // Only call onStateChange if tablaState has been initialized or changed significantly
    // Avoids calling on initial mount if tablaState is empty
    if (Object.keys(tablaState).length > 0 || Object.keys(tablaState).some(key => Object.keys(tablaState[key]).length > 0)) {
        onStateChange(id, tablaState);
    }
  }, [tablaState, id, onStateChange]);

  const handleNumberToggle = (segmento: string, number: number) => {
    setTablaState(prevState => {
      const currentSegmentoState = prevState[segmento] || { selectedNumbers: [], total: 0 };
      const currentSelected = currentSegmentoState.selectedNumbers;
      
      const newSelected = currentSelected.includes(number)
        ? currentSelected.filter(n => n !== number)
        : [...currentSelected, number];
      
      const newTotal = calculateTotal(newSelected);

      const newTablaState = {
        ...prevState,
        [segmento]: { selectedNumbers: newSelected, total: newTotal },
      };
      
      // onStateChange(id, newTablaState); // Removed from here
      
      return newTablaState;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-400">
      <div className="grid grid-ingredient-tabla">
        {/* Ingredient Name Cell */}
        <div 
          className="row-span-5 flex items-center justify-center border-r border-gray-400 text-center text-sm font-bold bg-gray-100 text-gray-800 p-2 ingredient-nombre-vertical"
        >
          {nombreVisible}
        </div>
        
        {/* Spacer Cell (Top-Left of the number grid) */}
        <div className="border-b border-r border-gray-400 bg-gray-100"></div>

        {/* Number Headers */}
        <div className="col-start-3 grid grid-cols-19 gap-px border-b border-gray-400 bg-gray-100">
          {NUMEROS_PLANILLA.map(num => (
            <div key={num} className="flex items-center justify-center h-7 border-r border-gray-300 last:border-r-0 text-[11px] font-bold text-gray-600">
              <span className={num === 100 ? 'numero-vertical' : ''}>{num}</span>
            </div>
          ))}
        </div>

        {/* Segment Rows */}
        {SEGMENTOS.map(segmento => (
          <React.Fragment key={segmento}>
            {/* Segment Name & Total Cell */}
            <div className="col-start-2 flex items-center justify-between px-1.5 py-1 border-b border-r border-gray-400 text-[11px] font-bold text-gray-700 bg-gray-50">
              <span className="uppercase">{segmento.replace('_', ' ')}</span>
              <span className="ml-2 text-blue-900 font-black text-sm px-2 py-0.5 bg-blue-100 rounded-md">
                {tablaState[segmento]?.total || 0}
              </span>
            </div>
            
            {/* Tablilla Cells for the Segment */}
            <div className="col-start-3 grid grid-cols-19 gap-px">
              {NUMEROS_PLANILLA.map((num) => (
                  <Tablilla
                    key={num}
                    isSelected={tablaState[segmento]?.selectedNumbers.includes(num) || false}
                    onClick={() => handleNumberToggle(segmento, num)}
                    disabled={isSaving}
                  />
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}


// ============================================================================
// // Main Component: PlanillaGrid
// ============================================================================
interface PlanillaGridProps {
  tipo: Role;
}

export function PlanillaGrid({ tipo }: PlanillaGridProps) {
  const [planillasData, setPlanillasData] = useState<PlanillasDataState>({});
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
        // Pass the 'tipo' prop to fetchIngredientes to get filtered results
        const [ingredientesData, localesData, turnosData] = await Promise.all([
          fetchIngredientes(tipo), fetchLocales(), fetchTurnos(),
        ]);
        
        console.log(`DEBUG: Loaded ${ingredientesData.length} ingredients for type '${tipo}'`, ingredientesData); // DEBUG LOG
        
        setIngredientes(ingredientesData);
        setLocales(localesData);
        setTurnos(turnosData);
        if (localesData.length > 0) setSelectedLocalId(localesData[0].id);
        if (turnosData.length > 0) setSelectedTurnoId(turnosData[0].id);
      } catch (err) {
        console.error(err);
        setError(`No se pudieron cargar los datos para la planilla de ${tipo}.`);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [tipo]); // Add 'tipo' to dependency array

  const handleTablaStateChange = useCallback((ingredienteId: string, tablaState: TablaState) => {
    // console.log(`[PlanillaGrid] handleTablaStateChange received id:`, ingredienteId); // Removed DEBUG LOG
    setPlanillasData(prevData => ({
      ...prevData,
      [ingredienteId]: tablaState,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaOperacion || !selectedTurnoId || !selectedLocalId) {
      setSaveError("Por favor, complete todos los campos: Fecha, Turno y Local.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    // console.log(`[PlanillaGrid] handleSubmit, current planillasData state:`, planillasData); // Removed DEBUG LOG
    const items: PlanillaItem[] = [];
    for (const ingredienteId in planillasData) { // Use ingredienteId
      if (Object.prototype.hasOwnProperty.call(planillasData, ingredienteId)) {
        const tablaState = planillasData[ingredienteId];
        for (const segmento in tablaState) {
          if (Object.prototype.hasOwnProperty.call(tablaState, segmento)) {
            if (tablaState[segmento].total > 0) {
              items.push({
                ingrediente: ingredienteId, // Use ingredienteId here
                segmento: segmento,
                cantidad: tablaState[segmento].total,
              });
            }
          }
        }
      }
    }

    try {
      await createPlanilla({
        fecha: fechaOperacion,
        tipo: tipo === "COCINA" ? 'COCINA' : 'CAJA',
        turnoId: selectedTurnoId,
        localId: selectedLocalId,
        items: items,
      });
      setSaveSuccess("¡Planilla guardada exitosamente!");
      setPlanillasData({});
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido.";
      setSaveError(`Error al guardar: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p className="p-10 text-center">Cargando datos necesarios...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          {/* <h3 className="text-3xl font-bold text-gray-900">Planilla de {tipo}</h3> */}
          <p className="mt-1 text-sm text-red-500">Llene los datos de inventario para cada ingrediente</p>
        </header>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 mb-8 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <label className="block text-sm  font-medium text-blue-500 mb-1" htmlFor="fechaPlanilla">
                  Fecha de Operación
                </label>
                <input
                  type="date"
                  id="fechaPlanilla"
                  value={fechaOperacion}
                  onChange={(e) => setFechaOperacion(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={isSaving}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1" htmlFor="turnoPlanilla">
                  Turno
                </label>
                <select
                  id="turnoPlanilla"
                  value={selectedTurnoId}
                  onChange={(e) => setSelectedTurnoId(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  disabled={isSaving}
                  required
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
                  required
                >
                  {locales.map((l) => (
                    <option key={l.id} value={l.id}>{l.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-8">
            {ingredientes.map(ing => (
              <IngredienteTabla
                key={ing.id} // Use ing.id here
                id={ing.id} // Pass id here
                nombreVisible={ing.nombreVisible}
                isSaving={isSaving}
                onStateChange={handleTablaStateChange}
              />
            ))}
          </div>

          <footer className="mt-12">
             <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              disabled={isSaving}
            >
              {isSaving ? "Guardando..." : "Guardar Planilla"}
            </button>
            {saveSuccess && (
              <div className="mt-4 p-4 text-sm bg-green-100 text-green-800 border border-green-200 rounded-lg">
                {saveSuccess}
              </div>
            )}
            {saveError && (
              <div className="mt-4 p-4 text-sm bg-red-100 text-red-800 border border-red-200 rounded-lg">
                {saveError}
              </div>
            )}
          </footer>
        </form>
      </div>
    </div>
  );
}
