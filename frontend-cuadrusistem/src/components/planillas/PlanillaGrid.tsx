import React, { useState, useEffect, useCallback } from "react";
import type { Role } from "../../store/useRoleStore";
import {
  fetchIngredientes,
  type IngredienteDef,
} from "../../services/ingredientes.service";
import { fetchLocales, type Local } from "../../services/locales.service";
import {
  createPlanilla,
} from "../../services/planillas.service";
import { fetchTurnos, type Turno } from "../../services/turnos.service";

// ============================================================================
// // Constants, Types, and Helpers
// ============================================================================
const SEGMENTOS = ["SALDO INICIAL", "ENTRADA", "DEVOLUC", "SALDO FINAL"];
const NUMEROS_GRID_COMPLETO = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0.5];

const calculateTotal = (selectedNums: number[]): number =>
  selectedNums.reduce((sum, num) => sum + num, 0);

const numberToSelected = (num: number): number[] => {
  const selected: number[] = [];
  let remaining = Number(num);
  if (remaining >= 100) { selected.push(100); remaining -= 100; }
  const decenas = Math.floor(remaining / 10) * 10;
  if (decenas >= 10) { selected.push(decenas); remaining -= decenas; }
  if (remaining >= 0.5) { selected.push(0.5); remaining -= 0.5; }
  const unidades = Math.round(remaining);
  if (unidades >= 1) { selected.push(unidades); }
  return selected;
};

type SegmentoState = { selectedNumbers: number[]; total: number };
type TablaState = Record<string, SegmentoState>;
type PlanillasDataState = Record<string, TablaState>;

// ============================================================================
// // Sub-components
// ============================================================================
const Tablilla = React.memo(({ isSelected, onClick, disabled }: { isSelected: boolean; onClick: () => void; disabled: boolean }) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={`h-full w-full cursor-pointer transition-all duration-75 active:scale-90 ${isSelected ? "bg-[#000033] shadow-inner" : "bg-white"} ${!disabled && !isSelected ? "hover:bg-blue-50" : ""} ${disabled ? "opacity-30 cursor-not-allowed bg-gray-100" : ""}`}
  />
));

const IngredienteTabla = React.memo(({ id, nombreVisible, isSavingOrLocked, data, onToggle }: { id: string; nombreVisible: string; isSavingOrLocked: boolean; data: TablaState; onToggle: (id: string, seg: string, n: number) => void }) => {
  const esFraccionable = nombreVisible.includes("Carne") || nombreVisible.includes("Lomo") || nombreVisible.includes("Ave");

  return (
    <div className="bg-black p-[1px] rounded-lg overflow-hidden shadow-md max-w-full text-[8px] sm:text-xs mb-4">
      <div className="grid grid-cols-planilla w-full border-l border-t border-black bg-gray-100">
        <div className="border-r border-b border-black h-6"></div>
        <div className="border-r border-b border-black h-6"></div>
        {NUMEROS_GRID_COMPLETO.map(n => (
          <div key={n} className="flex items-center justify-center border-r border-b border-black font-black text-[8px] sm:text-[10px]">
            {n === 100 ? <span className="-rotate-90">100</span> : n === 0.5 ? (esFraccionable ? "½" : "") : n}
          </div>
        ))}
        <div className="row-span-4 flex items-center justify-center border-r border-b border-black bg-white font-black text-center text-[10px] sm:text-xs uppercase [writing-mode:vertical-lr] rotate-180 py-2">
          {nombreVisible}
        </div>
        {SEGMENTOS.map(segmento => {
          const key = segmento.replace(" ", "_");
          const state = data[key] || { selectedNumbers: [], total: 0 };
          return (
            <React.Fragment key={segmento}>
              <div className="h-10 sm:h-12 min-w-[4.5rem] flex flex-col items-center justify-center border-r border-b border-black bg-gray-50 p-1">
                <div className="text-gray-600 leading-none text-[7px] sm:text-[9px] uppercase font-bold">{segmento}</div>
                <span className={`mt-1 text-[10px] font-black px-2 rounded ${state.total ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{state.total}</span>
              </div>
              {NUMEROS_GRID_COMPLETO.map(n => (
                <div key={`${segmento}-${n}`} className={`border-r border-b border-black h-10 sm:h-12 ${n === 0.5 && !esFraccionable ? 'bg-gray-100' : 'bg-white'}`}>
                  {(n !== 0.5 || esFraccionable) && (
                    <Tablilla isSelected={state.selectedNumbers.includes(n)} onClick={() => onToggle(id, segmento, n)} disabled={isSavingOrLocked} />
                  )}
                </div>
              ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
});

// ============================================================================
// // Main Page Component
// ============================================================================
export function PlanillaGrid({ tipo }: { tipo: Role }) {
  const [planillasData, setPlanillasData] = useState<PlanillasDataState>({});
  const [ingredientes, setIngredientes] = useState<IngredienteDef[]>([]);
  const [fechaOperacion, setFechaOperacion] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTurnoId, setSelectedTurnoId] = useState("");
  const [selectedLocalId, setSelectedLocalId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ t: 's' | 'e', m: string } | null>(null);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [locales, setLocales] = useState<Local[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  // 1. Cargar Catálogos
  useEffect(() => {
    (async () => {
      try {
        const [ing, loc, tur] = await Promise.all([fetchIngredientes(tipo), fetchLocales(), fetchTurnos()]);
        setIngredientes(ing); setLocales(loc); setTurnos(tur);
        if (loc.length) setSelectedLocalId(loc[0].id);
        if (tur.length) setSelectedTurnoId(tur[0].id);
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    })();
  }, [tipo]);

  // 2. Hidratación (PERSISTENCIA REAL)
  useEffect(() => {
    const hydrate = async () => {
      if (!selectedLocalId || !selectedTurnoId || !fechaOperacion) return;
      try {
        const { fetchPlanillaItems, fetchSaldoAnterior } = await import("../../services/planillas.service");
        const [ant, draft] = await Promise.all([
          fetchSaldoAnterior(selectedLocalId, selectedTurnoId, tipo as any),
          fetchPlanillaItems(selectedLocalId, fechaOperacion, selectedTurnoId, tipo as any)
        ]);

        const merged: PlanillasDataState = {};
        // Primero saldos anteriores
        Object.entries(ant).forEach(([id, qty]) => {
          merged[id] = { "SALDO_INICIAL": { selectedNumbers: numberToSelected(qty), total: qty } };
        });

        // Sobreescribir con borrador (MAREO DE CAMPOS CORREGIDO)
        if (draft.items?.length) {
          draft.items.forEach((it: any) => {
            const ingId = it.ingrediente_id || it.ingrediente; // Soporta ambos nombres de campo
            if (!merged[ingId]) merged[ingId] = {};
            merged[ingId][it.segmento] = {
              selectedNumbers: numberToSelected(it.cantidad),
              total: Number(it.cantidad)
            };
          });
          setIsLocked(draft.estado === 'ENVIADO');
        } else {
          setIsLocked(false);
        }
        setPlanillasData(merged);
      } catch (e) { console.error("Error hydrate:", e); }
    };
    hydrate();
  }, [selectedLocalId, selectedTurnoId, fechaOperacion, tipo, isSaving]);

  const handleToggle = useCallback((ingId: string, seg: string, n: number) => {
    const key = seg.replace(" ", "_");
    setPlanillasData(prev => {
      const ing = prev[ingId] || {};
      const s = ing[key] || { selectedNumbers: [], total: 0 };
      let next = [...s.selectedNumbers];
      if (next.includes(n)) { next = next.filter(x => x !== n); }
      else {
        if (n === 100) next = next.filter(x => x !== 100);
        else if (n >= 10) next = next.filter(x => x < 10 || x > 90);
        else if (n >= 1) next = next.filter(x => x < 1 || x > 9);
        else next = next.filter(x => x !== 0.5);
        next.push(n);
      }
      return { ...prev, [ingId]: { ...ing, [key]: { selectedNumbers: next, total: calculateTotal(next) } } };
    });
  }, []);

  const save = async (est: 'BORRADOR' | 'ENVIADO') => {
    setIsSaving(true); setStatusMsg(null);
    const items = Object.entries(planillasData).flatMap(([id, t]) => 
      Object.entries(t).map(([seg, s]) => ({ ingrediente: id, segmento: seg, cantidad: s.total }))
    ).filter(i => i.cantidad > 0);

    try {
      await createPlanilla({ fecha: fechaOperacion, tipo, turnoId: selectedTurnoId, localId: selectedLocalId, estado: est, items });
      setStatusMsg({ t: 's', m: est === 'ENVIADO' ? "¡Turno enviado!" : "¡Progreso guardado!" });
      if (est === 'ENVIADO') setIsLocked(true);
    } catch { setStatusMsg({ t: 'e', m: "Error al guardar." }); } finally { setIsSaving(false); }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center font-black text-indigo-600 animate-pulse">CARGANDO...</div>;

  return (
    <div className="max-w-full pb-32 px-2 sm:px-4">
      <div className="sticky top-0 z-30 py-4 bg-gray-50/90 backdrop-blur grid grid-cols-2 sm:grid-cols-4 gap-2 items-end">
        <div className="bg-white p-2 rounded-xl shadow-sm border">
          <label className="block text-[8px] font-bold text-gray-400 uppercase">Fecha</label>
          <input type="date" value={fechaOperacion} onChange={e => setFechaOperacion(e.target.value)} disabled={isLocked} className="w-full text-xs font-bold outline-none" />
        </div>
        <div className="bg-white p-2 rounded-xl shadow-sm border">
          <label className="block text-[8px] font-bold text-gray-400 uppercase">Turno</label>
          <select value={selectedTurnoId} onChange={e => setSelectedTurnoId(e.target.value)} disabled={isLocked} className="w-full text-xs font-bold outline-none">
            {turnos.map(t => <option key={t.id} value={t.id}>{t.tipo}</option>)}
          </select>
        </div>
        <div className="bg-white p-2 rounded-xl shadow-sm border">
          <label className="block text-[8px] font-bold text-gray-400 uppercase">Local</label>
          <select value={selectedLocalId} onChange={e => setSelectedLocalId(e.target.value)} disabled={isLocked} className="w-full text-xs font-bold outline-none">
            {locales.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
          </select>
        </div>
        <button onClick={() => setIsLocked(!isLocked)} className={`p-2 rounded-xl border-2 font-black text-[9px] uppercase flex items-center justify-center gap-2 ${isLocked ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-600'}`}>
          {isLocked ? "🔒 Cerrado" : "🔓 Abierto"}
        </button>
      </div>

      <div className="mt-4">{ingredientes.map(ing => <IngredienteTabla key={ing.id} id={ing.id} nombreVisible={ing.nombreVisible} isSavingOrLocked={isSaving || isLocked} data={planillasData[ing.id] || {}} onToggle={handleToggle} />)}</div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-100 flex flex-col gap-2 max-w-4xl mx-auto z-40">
        {statusMsg && <div className={`p-2 rounded-lg text-center text-[10px] font-bold text-white animate-bounce ${statusMsg.t === 's' ? 'bg-green-500' : 'bg-red-500'}`}>{statusMsg.m}</div>}
        <div className="flex gap-2">
          <button onClick={() => save('BORRADOR')} disabled={isSaving || isLocked} className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 font-black py-4 rounded-2xl text-[10px] uppercase shadow-lg">Guardar Avance</button>
          <button onClick={() => save('ENVIADO')} disabled={isSaving || isLocked} className="flex-[1.5] bg-indigo-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase shadow-indigo-200 shadow-xl">Enviar a Admin</button>
        </div>
      </div>
    </div>
  );
}
