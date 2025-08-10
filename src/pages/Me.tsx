import React from 'react';
import { useAuthStore } from '../store/authStore';

export const Me: React.FC = () => {
  const { user } = useAuthStore();
  if (!user) return <div className="p-8">No autenticado.</div>;
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mi perfil</h1>
      <div className="space-y-2">
        <div><span className="font-semibold">ID:</span> {user.id}</div>
        <div><span className="font-semibold">Email:</span> {user.email}</div>
        <div><span className="font-semibold">Rol Global:</span> {user.role_global}</div>
        <div><span className="font-semibold">Company ID:</span> {user.company_id ?? '—'}</div>
        <div><span className="font-semibold">Creado:</span> {new Date(user.created_at).toLocaleString()}</div>
      </div>
    </div>
  );
};


