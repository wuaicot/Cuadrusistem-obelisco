import { useRoleStore } from './store/useRoleStore';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { ReporteZUpload } from './components/reportes-z/ReporteZUpload';
import { PlanillaGrid } from './components/planillas/PlanillaGrid';
import { CuadreDisplay } from './components/cuadre/CuadreDisplay';

function App() {
  const { role } = useRoleStore();

  if (!role) {
    return <RoleSelectionPage />;
  }

  const getTitle = () => {
    switch (role) {
      case 'COCINA':
        return 'Planilla de Cocina';
      case 'CAJA':
        return 'Planilla de Caja';
      case 'ADMIN':
        return 'Panel de Administración';
      default:
        return 'CuadriSistem';
    }
  };

  const renderContent = () => {
    switch (role) {
      case 'ADMIN':
        return (
          <>
            <ReporteZUpload />
            <hr className="my-8" />
            <CuadreDisplay />
          </>
        );
      case 'COCINA':
      case 'CAJA':
        return <PlanillaGrid tipo={role} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (shown for Admin, can be adjusted for other roles) */}
      {role === 'ADMIN' && (
        <aside className="w-64 bg-gray-800 text-white p-4">
          <h2 className="text-xl font-bold mb-4">CuadriSistem</h2>
          <nav>
            <ul>
              <li className="mb-2">
                <a href="#" className="hover:bg-gray-700 p-2 block rounded">
                  Dashboard
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:bg-gray-700 p-2 block rounded">
                  Planillas
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:bg-gray-700 p-2 block rounded">
                  Reportes Z
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:bg-gray-700 p-2 block rounded">
                  Cuadres
                </a>
              </li>
            </ul>
          </nav>
        </aside>
      )}

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">{getTitle()}</h1>
          <button
            onClick={() => useRoleStore.getState().setRole(null)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Salir
          </button>
        </header>

        {/* Main Content */}
        <main className="p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
