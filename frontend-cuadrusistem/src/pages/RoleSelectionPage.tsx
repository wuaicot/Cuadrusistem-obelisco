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
    <div className="items-center justify-center h-screen bg-orange-500 pt-28 border-solid border-4 borderstyle-groove">
      <div className="text-center ">
        <h1 className="text-4xl font-bold mb-16"> <span className='border border-black text-5xl'>C</span>uadru<span >S</span>istem<span className=''> _OBELISCO®</span></h1>
        <div className="space-x-4">
          <button
            onClick={() => handleRoleSelection('COCINA')}
            className="bg-green-800 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-2xl border-2"
          >
            Cocina🍴
          </button>
          <button
            onClick={() => handleRoleSelection('CAJA')}
            className="bg-blue-800 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-2xl border-2"
          >
            Caja🥛
          </button>
          <button
            onClick={() => handleRoleSelection('ADMIN')}
            className="bg-purple-500 hover:bg-purple-700 text-grren font-bold py-4 px-8 rounded-lg text-2xl border-2"
          >
            Admin. ✍️
          </button>
        </div>
      </div>
    </div>
  );
}
