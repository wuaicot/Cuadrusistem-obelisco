import { useEffect } from 'react'
import { Routes, Route, Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { useRoleStore } from './store/useRoleStore'

import { RoleSelectionPage } from './pages/RoleSelectionPage'
import { AdminPage } from './pages/AdminPage'
import { CocinaPage } from './pages/CocinaPage'
import { CajaPage } from './pages/CajaPage'

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
      default:
        return 'CuadriSistem'
    }
  }

  const handleLogout = () => {
    setRole(null)
    navigate('/')
  }

  const isAdmin = location.pathname === '/admin'

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {isAdmin && (
        <aside className="w-64 bg-gray-800 text-white p-4">
          <h2 className="text-xl font-bold mb-4">CuadriSistem</h2>
          <nav>
            <ul>
              <li>
                <Link
                  to="/admin"
                  className="block rounded p-2 hover:bg-gray-700"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
      )}

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white p-4 shadow">
          <h1 className="text-2xl font-semibold">{getTitle()}</h1>
          <button
            onClick={handleLogout}
            className="rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
          >
            Volver
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
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
        <Route path="/cocina" element={<CocinaPage />} />
        <Route path="/caja" element={<CajaPage />} />
      </Route>
    </Routes>
  )
}

export default App
