import { useState, useEffect } from 'react';
import type { Local } from '../../services/locales.service';
import { fetchLocales } from '../../services/locales.service';

const turnoTipos = ['TURNO_I', 'TURNO_II'];

export function ReporteZUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [fechaOperacion, setFechaOperacion] = useState('');
  const [turno, setTurno] = useState(turnoTipos[0]);
  const [locales, setLocales] = useState<Local[]>([]);
  const [selectedLocalId, setSelectedLocalId] = useState('');
  const [loadingLocales, setLoadingLocales] = useState(true);
  const [errorLocales, setErrorLocales] = useState<string | null>(null);

  useEffect(() => {
    const getLocales = async () => {
      try {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !fechaOperacion || !turno || !selectedLocalId) {
      alert('Por favor, complete todos los campos.');
      return;
    }
    // TODO: Implement API call to upload the file and data
    console.log({
      file,
      fechaOperacion,
      turno,
      localId: selectedLocalId,
    });
    alert('Archivo listo para ser enviado (ver consola).');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">Cargar Reporte Z</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
            Archivo PNG del Reporte Z
          </label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cargar Reporte
        </button>
      </form>
    </div>
  );
}

