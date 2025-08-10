import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { companiesAPI, mapHttpError } from '../services/api';
import { RoleGuard } from '../components/RoleGuard';

export const CompanyCreateForm: React.FC = () => {
  const [name, setName] = React.useState<string>('');
  const [city, setCity] = React.useState<string>('');
  const mutation = useMutation({
    mutationFn: () => companiesAPI.createCompany({ name, city }),
    onSuccess: (c) => alert(`Creada company #${c.id}`),
    onError: (e) => alert(mapHttpError(e).message),
  });
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-3">Crear Compañía</h2>
      <div className="space-y-2">
        <input className="border w-full px-2 py-1 rounded" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border w-full px-2 py-1 rounded" placeholder="Ciudad" value={city} onChange={(e) => setCity(e.target.value)} />
        <button onClick={() => mutation.mutate()} className="bg-green-600 text-white px-4 py-2 rounded">Crear</button>
      </div>
    </div>
  );
};

export const CompanyRolesAdmin: React.FC = () => {
  const [userId, setUserId] = React.useState<number>(0);
  const [companyId, setCompanyId] = React.useState<number>(0);
  const [role, setRole] = React.useState<'GEN'|'REC'|'CARRIER'|'ADMIN'>('GEN');
  const assign = useMutation({
    mutationFn: () => companiesAPI.assignRole({ user_id: userId, company_id: companyId, role }),
    onSuccess: () => alert('Rol asignado'),
    onError: (e) => alert(mapHttpError(e).message),
  });
  const remove = useMutation({
    mutationFn: () => companiesAPI.removeRole({ user_id: userId, company_id: companyId, role }),
    onSuccess: () => alert('Rol eliminado'),
    onError: (e) => alert(mapHttpError(e).message),
  });
  return (
    <RoleGuard allow={['ADMIN']}>
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-3">Roles de Compañía (ADMIN)</h2>
        <div className="space-y-2">
          <input type="number" className="border w-full px-2 py-1 rounded" placeholder="User ID" value={userId} onChange={(e) => setUserId(Number(e.target.value))} />
          <input type="number" className="border w-full px-2 py-1 rounded" placeholder="Company ID" value={companyId} onChange={(e) => setCompanyId(Number(e.target.value))} />
          <select className="border w-full px-2 py-1 rounded" value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="GEN">GEN</option>
            <option value="REC">REC</option>
            <option value="CARRIER">CARRIER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <div className="flex gap-2">
            <button onClick={() => assign.mutate()} className="bg-blue-600 text-white px-4 py-2 rounded">Asignar</button>
            <button onClick={() => remove.mutate()} className="bg-red-600 text-white px-4 py-2 rounded">Eliminar</button>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};


