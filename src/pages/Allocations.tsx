import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { allocationsAPI, mapHttpError } from '../services/api';
import { RoleGuard } from '../components/RoleGuard';

export const AllocationCreateForm: React.FC = () => {
  const [lotId, setLotId] = React.useState<number>(0);
  const [qty, setQty] = React.useState<number>(0);
  const mutation = useMutation({
    mutationFn: () => allocationsAPI.createFixed({ lot_id: lotId, qty_kg: qty }),
    onSuccess: () => alert('Reserva creada'),
    onError: (e) => alert(mapHttpError(e).message),
  });
  return (
    <RoleGuard allow={['REC','ADMIN']}>
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-3">Crear Reserva</h2>
        <div className="space-y-2">
          <input type="number" className="border w-full px-2 py-1 rounded" placeholder="Lot ID" value={lotId} onChange={(e) => setLotId(Number(e.target.value))} />
          <input type="number" className="border w-full px-2 py-1 rounded" placeholder="Cantidad (kg)" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          <button onClick={() => mutation.mutate()} className="bg-blue-600 text-white px-4 py-2 rounded">Reservar</button>
        </div>
      </div>
    </RoleGuard>
  );
};

export const AllocationCancelForm: React.FC = () => {
  const [allocationId, setAllocationId] = React.useState<number>(0);
  const mutation = useMutation({
    mutationFn: () => allocationsAPI.cancel(allocationId),
    onSuccess: () => alert('Reserva cancelada'),
    onError: (e) => alert(mapHttpError(e).message),
  });
  return (
    <RoleGuard allow={['REC','ADMIN']}>
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-3">Cancelar Reserva</h2>
        <div className="space-y-2">
          <input type="number" className="border w-full px-2 py-1 rounded" placeholder="Allocation ID" value={allocationId} onChange={(e) => setAllocationId(Number(e.target.value))} />
          <button onClick={() => mutation.mutate()} className="bg-red-600 text-white px-4 py-2 rounded">Cancelar</button>
        </div>
      </div>
    </RoleGuard>
  );
};


