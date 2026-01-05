import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { Local } from '../../services/locales.service';
import { fetchLocales } from '../../services/locales.service';

const turnoTipos = ['TURNO_I', 'TURNO_II'];

export function ReporteZUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [fechaOperacion, setFechaOperacion] = useState('');
  const [turno, setTurno] = useState(turnoTipos[0]);
  const [locales, setLocales] = useState<Local[]>([]);
  const [selectedLocalId, setSelectedLocalId] = useState('');
  
  // State for UI feedback
  const [loadingLocales, setLoadingLocales] = useState(true);
  const [errorLocales, setErrorLocales] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  useEffect(() => {
    const getLocales = async () => {
      try {
        setLoadingLocales(true);
        const data = await fetchLocales();
        setLocales(data);
        if (data.length > 0) {
          setSelectedLocalId(data[0].id); // Select the first locale by default
        }
      } catch (error) {
        console.error('Error fetching locales:', error);
        setErrorLocales('No se pudieron cargar los locales.');
      } finally {
        setLoadingLocales(false);
      }
    };
    getLocales();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !fechaOperacion || !turno || !selectedLocalId) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('reporteZFile', file);
    formData.append('fechaOperacion', fechaOperacion);
    formData.append('turno', turno);
    formData.append('localId', selectedLocalId);

    try {
      const response = await api.post('/reporte-z', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setUploadSuccess('¡Reporte Z cargado y procesado exitosamente!');
        // Optionally reset form
        setFile(null);
        setFechaOperacion('');
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-4">Cargar Reporte Z</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
            Archivo PNG del Reporte Z
          </label>
          <input
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
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="turno">
            Turno
          </label>
          <select
            id="turno"
            value={turno}
            onChange={(e) => setTurno(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={isUploading}
          >
            {turnoTipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="local">
            Local
          </label>
          {loadingLocales ? (
            <p>Cargando locales...</p>
          ) : errorLocales ? (
            <p className="text-red-500">{errorLocales}</p>
          ) : (
            <select
              id="local"
              value={selectedLocalId}
              onChange={(e) => setSelectedLocalId(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={isUploading}
            >
              {locales.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-gray-400"
          disabled={isUploading}
        >
          {isUploading ? 'Cargando...' : 'Cargar Reporte'}
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

