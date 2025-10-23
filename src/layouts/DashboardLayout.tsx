import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">Sistema de Comissões</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/dashboard" className="hover:text-blue-600">🏠 Dashboard</Link>
          <Link to="/modulos" className="hover:text-blue-600">📦 Módulos</Link>
          <Link to="/empresas" className="hover:text-blue-600">🏢 Empresas</Link>
          <Link to="/vendedores" className="hover:text-blue-600">👥 Vendedores</Link>
          <Link to="/vendas" className="hover:text-blue-600">💰 Vendas</Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Painel</h1>
          <button className="text-sm text-red-500 hover:underline">Sair</button>
        </header>

        {/* Page content */}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
