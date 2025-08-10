import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

type Role = 'GEN' | 'REC' | 'CARRIER' | 'ADMIN';

interface RoleGuardProps {
  allow: Role[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allow, children }) => {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth" />;
  const role = user?.role_global as Role | undefined;
  if (!role || (!allow.includes(role) && role !== 'ADMIN')) {
    return <div className="p-8 text-center text-red-600">No tienes permisos para esta acción.</div>;
  }
  return <>{children}</>;
};


