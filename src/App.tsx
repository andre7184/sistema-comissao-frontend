import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
// IMPORTANTE: Use 'ReactNode' para a tipagem dos filhos
import type { ReactNode } from 'react'; 
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmpresasPage from './users/superadmin/pages/EmpresasPage';
import ModulosPage from './users/superadmin/pages/ModulosPage';
// ... outros imports

// Define os papéis para uso nas rotas
const ROLES = {
    SUPER_ADMIN: 'ROLE_SUPER_ADMIN', 
    ADMIN: 'ROLE_ADMIN', 
    VENDEDOR: 'ROLE_VENDEDOR', 
}

// A CORREÇÃO ESTÁ AQUI NA TIPAGEM DE 'children'
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode; // <--- CORREÇÃO: Aceita qualquer filho React
  allowedRoles: string[]; // Torna obrigatório para a validação de Role
}) {
  const { token, role } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  if (!role) {
    return <div style={{padding: '20px', textAlign: 'center'}}>Verificando autenticação e permissões...</div>;
  }

  // Se o role não estiver incluído nos papéis permitidos
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Renderiza o conteúdo (que pode ser um único elemento como <EmpresasPage />)
  return <>{children}</>; 
}


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login público */}
          <Route path="/" element={<Login />} />

          {/* Dashboard comum (Acesso para todos os logados) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.VENDEDOR]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Rotas exclusivas do Super Admin (Onde o erro estava ocorrendo) */}
          <Route
            path="/empresas"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                {/* O erro foi corrigido na definição de ProtectedRoute. */}
                <EmpresasPage /> 
              </ProtectedRoute>
            }
          />
          <Route
            path="/modulos"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <ModulosPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<h1>404 | Página Não Encontrada</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;