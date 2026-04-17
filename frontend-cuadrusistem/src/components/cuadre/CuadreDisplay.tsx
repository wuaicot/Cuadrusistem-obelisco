import { useState, useEffect, useMemo } from "react";
import {
  fetchUnprocessedReportesZ,
  type ReporteZ,
} from "../../services/reportesZ.service";
import {
  fetchPlanillasByType,
  type Planilla,
} from "../../services/planillas.service";
import {
  processCuadre,
  type CuadreResult,
} from "../../services/cuadre.service";
import { PROVEEDORES } from "../../data/preciosData";

// Helper function to determine the class for the 'diferencia' cell
function getDiferenciaClass(diferencia: number): string {
  if (diferencia < 0) return "text-red-600 font-bold";
  if (diferencia > 0) return "text-blue-600 font-bold";
  return "text-gray-500";
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(value);
};

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
  const [selectedReporteZId, setSelectedReporteZId] = useState("");
  const [selectedPlanillaCocinaId, setSelectedPlanillaCocinaId] = useState("");
  const [selectedPlanillaCajaId, setSelectedPlanillaCajaId] = useState("");

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
        const [reportesData, planillasCocinaData, planillasCajaData] =
          await Promise.all([
            fetchUnprocessedReportesZ(),
            fetchPlanillasByType("COCINA"),
            fetchPlanillasByType("CAJA"),
          ]);

        setReportesZ(Array.isArray(reportesData) ? reportesData : []);
        setPlanillasCocina(
          Array.isArray(planillasCocinaData) ? planillasCocinaData : [],
        );
        setPlanillasCaja(
          Array.isArray(planillasCajaData) ? planillasCajaData : [],
        );
      } catch (err) {
        console.error("Error loading initial data for cuadre:", err);
        setError("Error al cargar los datos necesarios para el cuadre.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [reporteZRefreshKey]);

  // Map ingredients to prices
  const valorizedData = useMemo(() => {
    if (!cuadreData || !cuadreData.detalle) return [];

    const allProducts = PROVEEDORES.flatMap((p) => p.productos);

    return Object.entries(cuadreData.detalle).map(([name, data]) => {
      const d = data as CuadreDetalle;
      // Heuristic: Find product by name (case insensitive, partial match)
      const product = allProducts.find(
        (p) =>
          name.toLowerCase().includes(p.nombre.toLowerCase()) ||
          p.nombre.toLowerCase().includes(name.toLowerCase()),
      );

      const precioUnitario = product ? product.precioNetoUnidad : 0;
      const valorDiferencia = d.diferencia * precioUnitario;

      return {
        nombre: name,
        ...d,
        precioUnitario,
        valorDiferencia,
      };
    });
  }, [cuadreData]);

  const financialSummary = useMemo(() => {
    return valorizedData.reduce(
      (acc, curr) => {
        if (curr.valorDiferencia < 0) acc.perdida += curr.valorDiferencia;
        else acc.sobrante += curr.valorDiferencia;
        return acc;
      },
      { perdida: 0, sobrante: 0 },
    );
  }, [valorizedData]);

  const handleProcessCuadre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedReporteZId ||
      !selectedPlanillaCocinaId ||
      !selectedPlanillaCajaId
    ) {
      setError(
        "Por favor, seleccione un Reporte Z, una Planilla de Cocina y una Planilla de Caja.",
      );
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
      const message =
        err instanceof Error ? err.message : "Ocurrió un error desconocido.";
      setError(`Error al procesar el cuadre: ${message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    if (!valorizedData.length) return;

    const headers = [
      "Ingrediente",
      "Planilla",
      "Venta (Z)",
      "Diferencia",
      "Costo Unitario",
      "Valorizacion",
    ];
    const rows = valorizedData.map((item) => [
      item.nombre,
      item.real,
      item.teorico,
      item.diferencia,
      item.precioUnitario,
      item.valorDiferencia,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `cuadre_inventario_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Cargando datos maestros...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; padding: 0; margin: 0; }
          .shadow-sm, .shadow-lg { shadow: none !important; border: 1px solid #eee !important; }
          .rounded-2xl { border-radius: 0 !important; }
        }
      `}</style>

      {/* Configuración del Cuadre */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 no-print">
        <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
          <span className="bg-blue-100 p-2 rounded-lg text-blue-600 text-sm">
            📊
          </span>
          Generar Reporte de Cuadre
        </h3>

        <form onSubmit={handleProcessCuadre} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="reporteZSelect"
                className="text-xs font-bold text-gray-400 uppercase ml-1"
              >
                Reporte Z
              </label>
              <select
                id="reporteZSelect"
                value={selectedReporteZId}
                onChange={(e) => setSelectedReporteZId(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                disabled={isProcessing}
                required
              >
                <option value="">Seleccione Reporte Z</option>
                {reportesZ.map((r) => (
                  <option key={r.id} value={r.id}>
                    {new Date(r.fechaOperacion).toLocaleDateString()} -{" "}
                    {r.turno_tipo} ({r.local_nombre})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="planillaCocinaSelect"
                className="text-xs font-bold text-gray-400 uppercase ml-1"
              >
                Planilla Cocina
              </label>
              <select
                id="planillaCocinaSelect"
                value={selectedPlanillaCocinaId}
                onChange={(e) => setSelectedPlanillaCocinaId(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                disabled={isProcessing}
                required
              >
                <option value="">Seleccione Planilla Cocina</option>
                {planillasCocina.map((p) => (
                  <option key={p.id} value={p.id}>
                    {new Date(p.fecha).toLocaleDateString()} - {p.turno_tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="planillaCajaSelect"
                className="text-xs font-bold text-gray-400 uppercase ml-1"
              >
                Planilla Caja
              </label>
              <select
                id="planillaCajaSelect"
                value={selectedPlanillaCajaId}
                onChange={(e) => setSelectedPlanillaCajaId(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                disabled={isProcessing}
                required
              >
                <option value="">Seleccione Planilla Caja</option>
                {planillasCaja.map((p) => (
                  <option key={p.id} value={p.id}>
                    {new Date(p.fecha).toLocaleDateString()} - {p.turno_tipo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none mt-4"
            disabled={isProcessing}
          >
            {isProcessing
              ? "ANALIZANDO INVENTARIO..."
              : "CALCULAR VALORIZACIÓN"}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 animate-pulse no-print">
          <span className="text-xl">⚠️</span>
          <p className="text-red-700 text-sm font-bold">{error}</p>
        </div>
      )}

      {cuadreData && (
        <div className="space-y-6">
          {/* Header de Exportación (solo visible en UI, no en print) */}
          <div className="flex flex-wrap items-center justify-between gap-4 no-print px-2">
            <h4 className="text-lg font-black text-gray-800 uppercase tracking-tighter">
              Resultados del Cuadre
            </h4>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-black border border-green-100 hover:bg-green-100 transition-colors"
              >
                <span>📗</span> EXCEL (CSV)
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-xs font-black border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <span>🖨️</span> EXPORTAR PDF
              </button>
            </div>
          </div>

          {/* Resumen Financiero Responsivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity no-print">
                <span className="text-6xl text-red-600">💸</span>
              </div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">
                Pérdida Total (Faltantes)
              </span>
              <span className="text-3xl font-black text-red-600">
                {formatCurrency(financialSummary.perdida)}
              </span>
              <p className="text-[10px] text-gray-400 mt-2 font-medium italic">
                Valor neto calculado según costos de proveedor.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity no-print">
                <span className="text-6xl text-blue-600">📈</span>
              </div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">
                Excedente Total (Sobrantes)
              </span>
              <span className="text-3xl font-black text-blue-600">
                {formatCurrency(financialSummary.sobrante)}
              </span>
              <p className="text-[10px] text-gray-400 mt-2 font-medium italic">
                Productos marcados de más o no registrados en venta.
              </p>
            </div>

            <div
              className={`bg-white p-6 rounded-2xl shadow-sm border-2 overflow-hidden relative group col-span-1 sm:col-span-2 lg:col-span-1 ${
                financialSummary.perdida + financialSummary.sobrante < 0
                  ? "border-red-100"
                  : "border-green-100"
              }`}
            >
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">
                Impacto Neto en Inventario
              </span>
              <span
                className={`text-3xl font-black ${financialSummary.perdida + financialSummary.sobrante < 0 ? "text-red-700" : "text-green-700"}`}
              >
                {formatCurrency(
                  financialSummary.perdida + financialSummary.sobrante,
                )}
              </span>
              <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden no-print">
                <style>{`
                  #impact-progress {
                    width: ${Math.min(100, Math.max(10, Math.abs((financialSummary.perdida + financialSummary.sobrante) / 10000) * 100))}%;
                  }
                `}</style>
                <div
                  id="impact-progress"
                  className={`h-full transition-all duration-1000 ${
                    financialSummary.perdida + financialSummary.sobrante < 0
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                ></div>
              </div>
            </div>
          </div>

          {/* Reporte Detallado - Responsivo (Cards en Mobile, Tabla en XL) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h4 className="font-black text-gray-800 uppercase text-sm tracking-tighter">
                Detalle de Valorización
              </h4>
              <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-gray-500 shadow-sm border border-gray-100">
                {valorizedData.length} ÍTEMS ANALIZADOS
              </span>
            </div>

            {/* VISTA MÓVIL/TABLET (Cards) - Se oculta en impresión para usar la tabla */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-px bg-gray-100 print:hidden">
              {valorizedData.map((item) => (
                <div key={item.nombre} className="bg-white p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-gray-900 leading-tight block w-2/3">
                      {item.nombre}
                    </span>
                    <span
                      className={`text-sm ${getDiferenciaClass(item.diferencia)} bg-gray-50 px-2 py-1 rounded-lg`}
                    >
                      {item.diferencia > 0 ? "+" : ""}
                      {item.diferencia}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">
                        Costo Neto
                      </span>
                      <span className="text-xs font-bold text-gray-700">
                        {formatCurrency(item.precioUnitario)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">
                        Valor Dif.
                      </span>
                      <span
                        className={`text-sm font-black ${item.valorDiferencia < 0 ? "text-red-600" : item.valorDiferencia > 0 ? "text-blue-600" : "text-gray-400"}`}
                      >
                        {formatCurrency(item.valorDiferencia)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                    <span>Planilla: {item.real}</span>
                    <span>Reporte Z: {item.teorico}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* VISTA DESKTOP E IMPRESIÓN (Tabla) */}
            <div className="hidden lg:block print:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Ingrediente
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                      Planilla
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                      Venta (Z)
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                      Diferencia
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                      Costo Neto
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                      Valorización
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {valorizedData.map((item) => (
                    <tr
                      key={item.nombre}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                          {item.nombre}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 font-medium">
                        {item.real}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 font-medium">
                        {item.teorico}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`text-sm px-3 py-1 rounded-full ${
                            item.diferencia < 0
                              ? "bg-red-50 text-red-600"
                              : item.diferencia > 0
                                ? "bg-blue-50 text-blue-600"
                                : "bg-gray-50 text-gray-400"
                          } font-black`}
                        >
                          {item.diferencia > 0 ? "+" : ""}
                          {item.diferencia}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-gray-400 font-bold italic">
                        {item.precioUnitario > 0
                          ? formatCurrency(item.precioUnitario)
                          : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span
                          className={`text-sm font-black ${
                            item.valorDiferencia < 0
                              ? "text-red-600"
                              : item.valorDiferencia > 0
                                ? "text-blue-600"
                                : "text-gray-300"
                          }`}
                        >
                          {formatCurrency(item.valorDiferencia)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
