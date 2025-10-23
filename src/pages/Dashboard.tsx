import { useNavigate } from 'react-router-dom';
import { useContext } from 'react'; 
import { AuthContext } from '../contexts/AuthContext'; 

// Importa os novos componentes específicos de Role
import SuperAdminDashboard from '../components/SuperAdminDashboard';
import AdminDashboard from '../components/AdminDashboard';
import VendedorDashboard from '../components/VendedorDashboard';

// O DashboardLayout agora é apenas o Dashboard, e não recebe 'children'
export default function Dashboard() { 
  // Usa role (que veio do JWT via AuthContext) e logout
  const { logout, role } = useContext(AuthContext); 
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  const renderContent = () => {
    switch (role) {
      case 'ROLE_SUPER_ADMIN':
        return <SuperAdminDashboard />;
      case 'ROLE_ADMIN':
        return <AdminDashboard />;
      case 'ROLE_VENDEDOR':
        return <VendedorDashboard />;
      default:
        // Caso o Role ainda não tenha sido carregado ou seja inválido
        return <div className="p-6 text-center text-red-500">Aguardando papel de usuário (Role) ou Papel não reconhecido.</div>;
    }
  };

  // Pode-se usar o 'role === null' (mas token existe) como um estado de 'carregando role'
  if (!role) {
      return <div className="flex justify-center items-center h-screen">Carregando Dashboard...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Mantenha uma navegação simples (pode ser aprimorada para ser condicional ao role) */}
      <aside className="w-64 bg-white shadow-md p-4">
         <div className="text-lg font-bold mb-6">Menu Principal</div>
         <button 
            onClick={() => navigate('/dashboard')}
            className="w-full text-left p-2 rounded hover:bg-gray-200"
         >
            Início
         </button>
         {/* Adicione outros links estáticos ou condicinais aqui */}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Painel de Controle</h1>
          <button
            onClick={handleLogout} 
            className="text-sm text-red-500 hover:underline"
          >
            Sair ({role}) {/* Mostra o role para depuração */}
          </button>
        </header>

        {/* Page content */}
        <main className="p-6 overflow-y-auto">
          {renderContent()} {/* <-- Renderiza o conteúdo específico aqui */}
        </main>
      </div>
    </div>
  );
}