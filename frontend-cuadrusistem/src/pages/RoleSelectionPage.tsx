import { useNavigate } from 'react-router-dom';
import { useRoleStore } from '../store/useRoleStore';
import type { Role } from '../store/useRoleStore';

export function RoleSelectionPage() {
  const { setRole } = useRoleStore();
  const navigate = useNavigate();

  const handleRoleSelection = (role: Role) => {
    setRole(role);
    switch (role) {
      case 'COCINA':
        navigate('/cocina');
        break;
      case 'CAJA':
        navigate('/caja');
        break;
      case 'ADMIN':
        navigate('/admin');
        break;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-red-600 p-4">
      <div className="w-full max-w-lg text-center fade-in">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight drop-shadow-xl">
            <span className="bg-white text-orange-600 px-3 py-1 rounded-xl mr-1 inline-block transform -rotate-3">C</span>uadri<span className="text-orange-200">S</span>istem
          </h1>
          <p className="text-orange-100 mt-4 text-xl font-medium tracking-widest opacity-90 uppercase">OBELISCO®</p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <button
            onClick={() => handleRoleSelection('COCINA')}
            className="group relative overflow-hidden bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white font-bold py-6 px-8 rounded-2xl text-2xl border border-white/30 shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <span className="text-3xl group-hover:rotate-12 transition-transform">🍽️</span>
            Cocina
          </button>
          
          <button
            onClick={() => handleRoleSelection('CAJA')}
            className="group relative overflow-hidden bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white font-bold py-6 px-8 rounded-2xl text-2xl border border-white/30 shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <span className="text-3xl group-hover:rotate-12 transition-transform">💵</span>
            Caja
          </button>
          
          <button
            onClick={() => handleRoleSelection('ADMIN')}
            className="group relative overflow-hidden bg-indigo-900/40 backdrop-blur-lg hover:bg-indigo-900/60 text-indigo-100 font-bold py-6 px-8 rounded-2xl text-2xl border border-indigo-400/30 shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <span className="text-3xl group-hover:rotate-12 transition-transform">✍️</span>
            Administración
          </button>
        </div>

        <footer className="mt-16 text-white/50 text-sm font-medium">
          © 2026 CuadruSistem-Obelisco.  Todos los derechos reservados. Naycol Linares.
        </footer>
      </div>
    </div>
  );
}
