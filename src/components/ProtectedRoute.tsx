import { Navigate } from 'react-router-dom';
import { useContext, type JSX } from 'react';
import { AuthContext } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { role } = useContext(AuthContext);

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
}
