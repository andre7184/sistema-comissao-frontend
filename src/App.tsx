import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import type { ReactNode } from 'react'; // <-- IMPORTANTE: Importe o ReactNode
import Modulos from './pages/Modulos';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

// 
// AQUI ESTÁ A CORREÇÃO
// 
// Troque 'JSX.Element' por 'ReactNode'
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useContext(AuthContext);
  if (!token) {
    // Redireciona para o login se não houver token
    return <Navigate to="/" replace />;
  }
  // 'children' agora é do tipo ReactNode e funcionará corretamente
  return <>{children}</>; 
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard children={undefined} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modulos"
            element={
              <ProtectedRoute>
                <Modulos />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;