import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react'; // <-- IMPORTAR
import { AuthContext } from '../contexts/AuthContext'; // <-- IMPORTAR

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { logout } = useContext(AuthContext); // <-- USAR CONTEXTO
  const navigate = useNavigate(); // <-- USAR NAVIGATE

  const handleLogout = () => {
    logout();
    navigate('/'); // Redireciona para o login
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ... Sidebar ... */}
      <aside className="w-64 bg-white shadow-md p-4">
         {/* ... links ... */}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Painel</h1>
          <button
            onClick={handleLogout} // <-- ADICIONADO
            className="text-sm text-red-500 hover:underline"
          >
            Sair
          </button>
        </header>

        {/* Page content */}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}