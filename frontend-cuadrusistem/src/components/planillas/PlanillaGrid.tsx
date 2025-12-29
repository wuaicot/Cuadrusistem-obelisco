import { useState } from 'react';
import type { Role } from '../../store/useRoleStore';

// Mock data based on backend's ingredientes.master.ts
const INGREDIENTES = [
  { codigo: 'PAN_MESA_SUPER_GIGAN', nombreVisible: 'Pan mesa súper Gigan' },
  { codigo: 'VIENESA_PERSONAL', nombreVisible: 'Vienesa personal' },
  { codigo: 'COCA_COLA_LATA', nombreVisible: 'Coca-Cola lata' },
  { codigo: 'COCA_COLA_591CC', nombreVisible: 'Coca-Cola 591cc' },
  { codigo: 'AGUA_SIN_GAS', nombreVisible: 'Agua sin gas' },
  { codigo: 'MASA_EMP_EMP', nombreVisible: 'Masa empanada' },
  { codigo: 'PINO_CARNE', nombreVisible: 'Pino de carne' },
  { codigo: 'QUESO_EMP', nombreVisible: 'Queso empanada' },
];

const SEGMENTOS = ['SALDO_INICIAL', 'ENTRADA', 'DEVOLUC', 'SALDO_FINAL'];

type PlanillaData = Record<string, Record<string, number>>;

interface PlanillaGridProps {
  tipo: Role;
}

export function PlanillaGrid({ tipo }: PlanillaGridProps) {
  const [data, setData] = useState<PlanillaData>({});

  const handleCellChange = (
    codigo: string,
    segmento: string,
    value: string
  ) => {
    const numericValue = parseInt(value, 10);
    setData((prevData) => ({
      ...prevData,
      [codigo]: {
        ...prevData[codigo],
        [segmento]: isNaN(numericValue) ? 0 : numericValue,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save the planilla data
    console.log({ tipo, data });
    alert('Planilla lista para ser enviada (ver consola).');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingrediente
                </th>
                {SEGMENTOS.map((segmento) => (
                  <th
                    key={segmento}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {segmento.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {INGREDIENTES.map((ingrediente) => (
                <tr key={ingrediente.codigo}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ingrediente.nombreVisible}
                  </td>
                  {SEGMENTOS.map((segmento) => (
                    <td key={segmento} className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        title={`${ingrediente.nombreVisible} - ${segmento.replace('_', ' ')}`}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={data[ingrediente.codigo]?.[segmento] || ''}
                        onChange={(e) =>
                          handleCellChange(
                            ingrediente.codigo,
                            segmento,
                            e.target.value
                          )
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Guardar Planilla
          </button>
        </div>
      </form>
    </div>
  );
}
