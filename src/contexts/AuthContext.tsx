import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useMemo } from 'react'; // Importe useMemo
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  token: string | null;
  role: string | null;
  permissoes: string[] | null; // <-- ADICIONADO
  login: (token: string, permissoes: string[]) => void; // <-- MODIFICADO
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  permissoes: null, // <-- ADICIONADO
  login: () => {},
  logout: () => {},
});

// Helper para pegar permissoes do localStorage
const getStoredPermissoes = (): string[] | null => {
  const stored = localStorage.getItem('permissoes');
  return stored ? JSON.parse(stored) : null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(null);
  const [permissoes, setPermissoes] = useState<string[] | null>(getStoredPermissoes()); // <-- ADICIONADO

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setRole(decoded.role || null);
      } catch (e) {
        console.error('Token inválido:', e);
        // Se o token for inválido, deslogar
        logout();
      }
    }
  }, [token]);

  const login = (newToken: string, newPermissoes: string[]) => { // <-- MODIFICADO
    localStorage.setItem('token', newToken);
    localStorage.setItem('permissoes', JSON.stringify(newPermissoes)); // <-- ADICIONADO
    setToken(newToken);
    setPermissoes(newPermissoes); // <-- ADICIONADO
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('permissoes'); // <-- ADICIONADO
    setToken(null);
    setRole(null);
    setPermissoes(null); // <-- ADICIONADO
  };

  // Usar useMemo para evitar recriação desnecessária do objeto 'value'
  const contextValue = useMemo(() => ({
    token,
    role,
    permissoes, // <-- ADICIONADO
    login,
    logout,
  }), [token, role, permissoes]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};