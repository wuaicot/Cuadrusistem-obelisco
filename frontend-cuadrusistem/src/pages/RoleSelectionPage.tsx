import { useRoleStore } from '../store/useRoleStore';
import type { Role } from '../store/useRoleStore';

export function RoleSelectionPage() {
  const { setRole } = useRoleStore();

  const handleRoleSelection = (role: Role) => {
    setRole(role);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 bg-yellow-200">
      <div className="text-center">
        <h1 className="text-4xl bg-black font-bold mb-8">Bienvenido a CuadriSistem</h1>
        <div className="space-x-4">
          <button
            onClick={() => handleRoleSelection('COCINA')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-2xl"
          >
            Cocina
          </button>
          <button
            onClick={() => handleRoleSelection('CAJA')}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-2xl"
          >
            Caja
          </button>
          <button
            onClick={() => handleRoleSelection('ADMIN')}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-2xl"
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
}
