import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

// Interface para o payload do JWT, assumindo que o backend inclui o 'role'
interface DecodedToken {
  sub: string; // subject (geralmente o ID do usuário)
  role: 'ROLE_SUPER_ADMIN' | 'ROLE_ADMIN' | 'ROLE_VENDEDOR' | string;
  exp: number; // expiration time
  iat: number; // issued at
  // Outras claims customizadas do seu token
}

interface AuthContextType {
  token: string | null;
  role: string | null; // <-- Papel do usuário
  permissoes: string[] | null; // <-- Permissões de Módulo
  login: (token: string, permissoes: string[]) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  permissoes: null,
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
  const [permissoes, setPermissoes] = useState<string[] | null>(getStoredPermissoes());

  useEffect(() => {
    if (token) {
      try {
        // Usa a interface tipada para o token decodificado
        const decoded = jwtDecode<DecodedToken>(token);
        // O papel (Role) vem do payload do JWT
        setRole(decoded.role || null);
      } catch (e) {
        console.error('Token inválido ou expirado:', e);
        // Se o token for inválido, deslogar para remover o token inválido
        logout();
      }
    } else {
        // Garante que o role seja limpo se o token não existir
        setRole(null);
    }
  }, [token]);

  const login = (newToken: string, newPermissoes: string[]) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('permissoes', JSON.stringify(newPermissoes));
    setToken(newToken);
    setPermissoes(newPermissoes);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('permissoes');
    setToken(null);
    setRole(null);
    setPermissoes(null);
  };

  // Usa useMemo para evitar recriação desnecessária do objeto 'value'
  const contextValue = useMemo(() => ({
    token,
    role,
    permissoes,
    login,
    logout,
  }), [token, role, permissoes]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};