// frontend-cuadrusistem/src/components/reportes-z/ReporteZUpload.tsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { Local } from '../../services/locales.service';
import { fetchLocales } from '../../services/locales.service';
import type { Turno } from '../../services/turnos.service';
import { fetchTurnos } from '../../services/turnos.service';

interface ReporteZUploadProps {
  onUploadSuccess: () => void;
}

export function ReporteZUpload({ onUploadSuccess }: ReporteZUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fechaOperacion, setFechaOperacion] = useState('');
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [selectedTurnoId, setSelectedTurnoId] = useState('');
  const [locales, setLocales] = useState<Local[]>([]);
  const [selectedLocalId, setSelectedLocalId] = useState('');
  
  // State for UI feedback
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [errorInitial, setErrorInitial] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingInitial(true);
        const [localesData, turnosData] = await Promise.all([
          fetchLocales(),
          fetchTurnos()
        ]);
        
        setLocales(localesData);
        setTurnos(turnosData);

        if (localesData.length > 0) {
          setSelectedLocalId(localesData[0].id);
        }
        if (turnosData.length > 0) {
          setSelectedTurnoId(turnosData[0].id);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setErrorInitial('No se pudieron cargar los datos iniciales (locales/turnos).');
      } finally {
        setLoadingInitial(false);
      }
    };
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      // Reset feedback on new file selection
      setUploadSuccess(null);
      setUploadError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !fechaOperacion || !selectedTurnoId || !selectedLocalId) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('reporteZFile', file);
    formData.append('fechaOperacion', fechaOperacion);
    formData.append('turnoId', selectedTurnoId);
    formData.append('localId', selectedLocalId);

    try {
      const response = await api.post('/reporte-z', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setUploadSuccess(response.data.message || '¡Reporte Z cargado y procesado exitosamente!');
        setFile(null); 
        if (e.target instanceof HTMLFormElement) {
          e.target.reset();
        }
        onUploadSuccess();
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      const message =
        error.response?.data?.message || 'Error desconocido al cargar el archivo.';
      setUploadError(`Error: ${message}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (loadingInitial) return <p className="text-center p-4">Cargando datos iniciales...</p>;
  if (errorInitial) return <p className="text-center p-4 text-red-500">{errorInitial}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-4 text-center">Cargar Reporte Z</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
            Archivo PNG/JPG del Reporte Z
          </label>
          <input
            key={file ? 'file-selected' : 'file-empty'} 
            type="file"
            id="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={isUploading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha">
            Fecha de Operación
          </label>
          <input
            type="date"
            id="fecha"
            value={fechaOperacion}
            onChange={(e) => setFechaOperacion(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={isUploading}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="turno">
            Turno
          </label>
          <select
            id="turno"
            value={selectedTurnoId}
            onChange={(e) => setSelectedTurnoId(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={isUploading}
            required
          >
            {turnos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.tipo} ({t.fecha})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="local">
            Local
          </label>
          <select
            id="local"
            value={selectedLocalId}
            onChange={(e) => setSelectedLocalId(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-gray-400"
          disabled={isUploading || !file || !fechaOperacion || !selectedLocalId || !selectedTurnoId}
        >
          {isUploading ? 'Cargando...' : 'Cargar y Procesar Reporte'}
        </button>

        {uploadSuccess && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 border border-green-300 rounded">
            {uploadSuccess}
          </div>
        )}
        {uploadError && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 border border-red-300 rounded">
            {uploadError}
          </div>
        )}
      </form>
    </div>
  );
}


