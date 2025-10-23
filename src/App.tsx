import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, type JSX } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ModulosPage from './users/superadmin/pages/ModulosPage';
import EmpresasPage from './users/superadmin/pages/EmpresasPage';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles?: string[];
}) {
  const { token, role } = useContext(AuthContext);

  if (!token) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(role ?? '')) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login público */}
          <Route path="/" element={<Login />} />

          {/* Dashboard comum (pode ser adaptado por tipo de usuário) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Rotas exclusivas do Super Admin */}
          <Route
            path="/empresas"
            element={
              <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']}>
                <EmpresasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modulos"
            element={
              <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']}>
                <ModulosPage />
              </ProtectedRoute>
            }
          />

          {/* Aqui você pode adicionar outras rotas do Super Admin */}
          {/* <Route path="/usuarios" element={<ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']}><UsuariosPage /></ProtectedRoute>} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
