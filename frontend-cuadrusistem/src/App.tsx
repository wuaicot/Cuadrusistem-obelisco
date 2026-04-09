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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop Only */}
      {isAdmin && (
        <aside className="hidden md:flex w-72 bg-slate-900 text-white flex-col border-r border-slate-800">
          <div className="p-8">
            <h2 className="text-2xl font-black tracking-tighter text-white">
              <span className="bg-blue-600 px-2 py-1 rounded-lg mr-1">C</span>uadriSistem
            </h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1 ml-1">Admin Panel</p>
          </div>
          
          <nav className="flex-1 px-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin"
                  className={`flex items-center gap-3 rounded-xl p-4 transition-all duration-200 ${
                    location.pathname === '/admin' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-bold' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-xl">📊</span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/precios"
                  className={`flex items-center gap-3 rounded-xl p-4 transition-all duration-200 ${
                    location.pathname === '/admin/precios' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-bold' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-xl">💰</span>
                  Precios
                </Link>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 p-4 text-sm font-bold text-slate-300 hover:bg-red-900/20 hover:text-red-400 transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        </aside>
      )}

      <div className="flex flex-1 flex-col relative overflow-hidden">
        {/* Header - Transparent & Blurred */}
        <header className="sticky top-0 z-50 flex items-center justify-between glass px-4 py-3 sm:px-6 border-b border-gray-200/50">
          <div className="flex items-center gap-4">
            {/* Mobile Home Link / Logo */}
            <div className="md:hidden font-black text-blue-600 text-xl tracking-tighter">
              C.S
            </div>
            <h1 className="text-lg sm:text-xl font-black text-gray-800 tracking-tight uppercase">{getTitle()}</h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-black text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95 uppercase tracking-widest border border-gray-200"
          >
           SALIR 
          </button>
        </header>

        {/* Content - Smooth Vertical Scroll Only */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
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
