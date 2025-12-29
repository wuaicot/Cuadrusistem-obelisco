import { useState } from 'react';

// Mock data based on backend's CuadreEntity
const mockCuadreDetalle = {
  'Vienesa personal': {
    teorico: 12,
    real: 11,
    diferencia: -1,
  },
  'Pan mesa súper Gigan': {
    teorico: 12,
    real: 12,
    diferencia: 0,
  },
  'Coca-Cola lata': {
    teorico: 20,
    real: 22,
    diferencia: 2,
  },
};

const turnoTipos = ['TURNO_I', 'TURNO_II'];

export function CuadreDisplay() {
  const [fechaOperacion, setFechaOperacion] = useState('');
  const [turno, setTurno] = useState(turnoTipos[0]);
  const [cuadreData, setCuadreData] = useState<typeof mockCuadreDetalle | null>(null);

  const handleFetchCuadre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaOperacion || !turno) {
      alert('Por favor, seleccione fecha y turno.');
      return;
    }
    // TODO: Implement API call to fetch cuadre data
    console.log({ fechaOperacion, turno });
    setCuadreData(mockCuadreDetalle);
  };

  const getDiferenciaClass = (diferencia: number) => {
    if (diferencia < 0) return 'text-red-500 font-bold';
    if (diferencia > 0) return 'text-yellow-500 font-bold';
    return 'text-green-500';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-2xl font-bold mb-4">Visualizar Cuadre</h3>
      <form onSubmit={handleFetchCuadre} className="flex items-end space-x-4 mb-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha-cuadre">
            Fecha de Operación
          </label>
          <input
            type="date"
            id="fecha-cuadre"
            value={fechaOperacion}
            onChange={(e) => setFechaOperacion(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="turno-cuadre">
            Turno
          </label>
          <select
            id="turno-cuadre"
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
        <button
          type="submit"
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Buscar Cuadre
        </button>
      </form>

      {cuadreData && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingrediente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo Teórico</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo Real</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diferencia</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(cuadreData).map(([ingrediente, detalle]) => (
              <tr key={ingrediente}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ingrediente}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{detalle.teorico}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{detalle.real}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getDiferenciaClass(detalle.diferencia)}`}>
                  {detalle.diferencia}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
