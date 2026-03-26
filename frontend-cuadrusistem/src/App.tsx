import { useEffect } from 'react'
import { Routes, Route, Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { useRoleStore } from './store/useRoleStore'

import { RoleSelectionPage } from './pages/RoleSelectionPage'
import { AdminPage } from './pages/AdminPage'
import { CocinaPage } from './pages/CocinaPage'
import { CajaPage } from './pages/CajaPage'
import { PreciosProveedorPage } from './pages/PreciosProveedorPage'

/* ---------- Layout ---------- */
function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setRole } = useRoleStore()

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(
        `%c[Navigation] → ${location.pathname}`,
        'color:#8a2be2;font-weight:bold'
      )
    }
  }, [location.pathname])

  const getTitle = () => {
    switch (location.pathname) {
      case '/cocina':
        return 'Planilla de Cocina'
      case '/caja':
        return 'Planilla de Caja'
      case '/admin':
        return 'Panel de Administración'
      case '/admin/precios':
        return 'Precios por Proveedor'
      default:
        return 'CuadriSistem'
    }
  }

  const handleLogout = () => {
    setRole(null)
    navigate('/')
  }

  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {isAdmin && (
        <aside className="hidden md:block w-64 bg-gray-900 text-white p-4">
          <h2 className="text-xl font-bold mb-8 text-blue-400">CuadriSistem Admin</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin"
                  className={`block rounded p-3 transition-colors ${location.pathname === '/admin' ? 'bg-blue-600 font-bold' : 'hover:bg-gray-800'}`}
                >
                  📊 Dashboard & Cuadres
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/precios"
                  className={`block rounded p-3 transition-colors ${location.pathname === '/admin/precios' ? 'bg-blue-600 font-bold' : 'hover:bg-gray-800'}`}
                >
                  💰 Precios por Proveedor
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
      )}

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white p-4 shadow-sm z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{getTitle()}</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
           SALIR 
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/* ---------- Router ---------- */
function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelectionPage />} />

      <Route element={<AppLayout />}>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/precios" element={<PreciosProveedorPage />} />
        <Route path="/cocina" element={<CocinaPage />} />
        <Route path="/caja" element={<CajaPage />} />
      </Route>
    </Routes>
  )
}

export default App
