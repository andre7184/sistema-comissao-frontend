import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function AdminDashboard() {
  const { permissoes } = useContext(AuthContext);

  // O acesso a Vendas/Vendedores requer o módulo COMISSOES_CORE ativo. [cite: 141, 189]
  const temComissoesCore = permissoes?.includes('COMISSOES_CORE');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Painel do Administrador da Empresa</h2>
      <h3 className="text-xl font-semibold mt-6 mb-3">Ações de Gerenciamento</h3>
      
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-md mb-6">
        <p className="font-semibold text-yellow-800">Módulos Ativos:</p>
        <p className="text-sm text-yellow-700">{permissoes?.length ? permissoes.join(', ') : 'Nenhum módulo ativo.'}</p>
        <Link to="/empresa/meus-modulos" className="mt-2 inline-block text-yellow-600 hover:text-yellow-800 text-sm">
           (Ver Detalhes dos Módulos)
       </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {temComissoesCore ? (
            <>
              <Link to="/admin/vendedores" className="p-6 bg-indigo-100 rounded-lg shadow hover:bg-indigo-200 transition">
                <h3 className="text-xl font-semibold text-indigo-800">Gerenciar Vendedores</h3>
                <p className="text-sm text-indigo-600">Criação e atualização de vendedores.</p>
              </Link>
              <Link to="/admin/vendas" className="p-6 bg-pink-100 rounded-lg shadow hover:bg-pink-200 transition">
                <h3 className="text-xl font-semibold text-pink-800">Gerenciar Lançamentos de Vendas</h3>
                <p className="text-sm text-pink-600">Lançar novas vendas para cálculo de comissão.</p>
              </Link>
            </>
        ) : (
             <div className="md:col-span-2 p-6 bg-red-100 border-l-4 border-red-500 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-red-800">Módulo Core Inativo</h3>
                <p className="text-base text-red-600">O gerenciamento de Vendas e Vendedores está bloqueado. Contrate o **COMISSOES_CORE** para habilitar.</p>
            </div>
        )}
      </div>
    </div>
  );
}