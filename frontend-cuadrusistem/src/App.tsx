import { useEffect } from 'react';
import { Routes, Route, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useRoleStore } from './store/useRoleStore';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { AdminPage } from './pages/AdminPage';
import { CocinaPage } from './pages/CocinaPage';
import { CajaPage } from './pages/CajaPage';

// Layout component to wrap pages with sidebar and header
function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setRole } = useRoleStore();

  // Log route changes for development
  useEffect(() => {
    console.log(
      `%c[Navigation] => ${location.pathname}`,
      'color: #8a2be2; font-weight: bold;'
    );
  }, [location.pathname]);

  const getTitle = () => {
    switch (location.pathname) {
      case '/cocina':
        return 'Planilla de Cocina';
      case '/caja':
        return 'Planilla de Caja';
      case '/admin':
        return 'Panel de Administración';
      default:
        return 'CuadriSistem';
    }
  };

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };
  
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (shown for Admin) */}
      {isAdmin && (
        <aside className="w-64 bg-gray-800 text-white p-4">
          <h2 className="text-xl font-bold mb-4">CuadriSistem</h2>
          <nav>
            <ul>
              <li className="mb-2">
                <Link to="/admin" className="hover:bg-gray-700 p-2 block rounded">
                  Dashboard
                </Link>
              </li>
              {/* Add other admin links here if needed */}
            </ul>
          </nav>
        </aside>
      )}

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">{getTitle()}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 bg-black rounded"
          >
            Volver
          </button>
        </header>

        {/* Main Content */}
        <main className="p-6 overflow-y-auto">
          <Outlet /> {/* Child routes will be rendered here */}
        </main>
      </div>
    </div>
  );
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelectionPage />} />
      <Route element={<AppLayout />}>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/cocina" element={<CocinaPage />} />
        <Route path="/caja" element={<CajaPage />} />
      </Route>
    </Routes>
  );
}

export default App;
