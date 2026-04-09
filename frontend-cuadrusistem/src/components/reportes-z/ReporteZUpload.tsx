// frontend-cuadrusistem/src/components/reportes-z/ReporteZUpload.tsx
import { useState, useEffect } from "react";
import api from "../../services/api";
import type { Local } from "../../services/locales.service";
import { fetchLocales } from "../../services/locales.service";
import type { Turno } from "../../services/turnos.service";
import { fetchTurnos } from "../../services/turnos.service";

interface ReporteZUploadProps {
  onUploadSuccess: () => void;
}

export function ReporteZUpload({ onUploadSuccess }: ReporteZUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fechaOperacion, setFechaOperacion] = useState("");
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [selectedTurnoId, setSelectedTurnoId] = useState("");
  const [locales, setLocales] = useState<Local[]>([]);
  const [selectedLocalId, setSelectedLocalId] = useState("");

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingInitial(true);
        const [localesData, turnosData] = await Promise.all([
          fetchLocales(),
          fetchTurnos(),
        ]);

        const safeLocales = Array.isArray(localesData) ? localesData : [];
        const safeTurnos = Array.isArray(turnosData) ? turnosData : [];

        setLocales(safeLocales);
        setTurnos(safeTurnos);

        if (safeLocales.length > 0) setSelectedLocalId(safeLocales[0].id);
        if (safeTurnos.length > 0) setSelectedTurnoId(safeTurnos[0].id);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoadingInitial(false);
      }
    };
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setUploadSuccess(null);
      setUploadError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !fechaOperacion || !selectedTurnoId || !selectedLocalId)
      return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append("reporteZFile", file);
    formData.append("fechaOperacion", fechaOperacion);
    formData.append("turnoId", selectedTurnoId);
    formData.append("localId", selectedLocalId);

    try {
      const response = await api.post("/reporte-z", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setUploadSuccess("¡Reporte Z procesado con éxito!");
        setFile(null);
        if (e.target instanceof HTMLFormElement) e.target.reset();
        onUploadSuccess();
      }
    } catch (error: unknown) {
      let message = "Error al cargar el archivo.";
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        message = axiosError.response?.data?.message || message;
      }
      setUploadError(message);
    } finally {

      setIsUploading(false);
    }
  };

  if (loadingInitial)
    return (
      <div className="flex justify-center p-8">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="group">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Archivo PNG/JPG del Reporte Z
          </label>
          <div className="relative">
            <input
              type="file"
              id="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            <label
              htmlFor="file"
              className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-[1.5rem] cursor-pointer transition-all ${
                file
                  ? "border-indigo-500 bg-indigo-50/50"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
              }`}
            >
              <span className="text-3xl mb-2">{file ? "✅" : "📷"}</span>
              <span className="text-sm font-bold text-gray-700">
                {file ? file.name : "Seleccionar o Tomar Foto"}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG hasta 10MB
              </span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label
              htmlFor="fecha-z"
              className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1"
            >
              Fecha
            </label>
            <input
              id="fecha-z"
              type="date"
              value={fechaOperacion}
              onChange={(e) => setFechaOperacion(e.target.value)}
              className="w-full p-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500"
              disabled={isUploading}
              required
            />
          </div>

          <div className="sm:col-span-1">
            <label
              htmlFor="turno-z"
              className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1"
            >
              Turno
            </label>
            <select
              id="turno-z"
              value={selectedTurnoId}
              onChange={(e) => setSelectedTurnoId(e.target.value)}
              className="w-full p-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 appearance-none"
              disabled={isUploading}
              required
            >
              {turnos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <label
              htmlFor="local-z"
              className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1"
            >
              Local
            </label>
            <select
              id="local-z"
              value={selectedLocalId}
              onChange={(e) => setSelectedLocalId(e.target.value)}
              className="w-full p-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 appearance-none"
              disabled={isUploading}
              required
            >
              {locales.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isUploading || !file}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm"
        >
          {isUploading ? "Procesando con OCR..." : "Cargar y Procesar Reporte"}
        </button>

        {uploadSuccess && (
          <div className="p-4 bg-green-500 text-white text-center rounded-2xl font-bold shadow-lg animate-bounce">
            {uploadSuccess}
          </div>
        )}
        {uploadError && (
          <div className="p-4 bg-red-500 text-white text-center rounded-2xl font-bold shadow-lg">
            {uploadError}
          </div>
        )}
      </form>
    </div>
  );
}
