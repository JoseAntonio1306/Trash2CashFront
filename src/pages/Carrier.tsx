import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { carrierAPI, mapHttpError } from '../services/api';
import { RoleGuard } from '../components/RoleGuard';

export const CarrierProfile: React.FC = () => {
  const { data, refetch } = useQuery({ queryKey: ['carrierProfile'], queryFn: () => carrierAPI.getMyProfile() });
  const [vehiclePlate, setVehiclePlate] = React.useState<string>('');
  const [capacity, setCapacity] = React.useState<number | ''>('');
  const mutation = useMutation({
    mutationFn: () => carrierAPI.upsertProfile({ vehicle_plate: vehiclePlate || null, capacity_kg: capacity === '' ? null : Number(capacity) }),
    onSuccess: () => { alert('Perfil actualizado'); refetch(); },
    onError: (e) => alert(mapHttpError(e).message),
  });
  React.useEffect(() => {
    if (data) {
      setVehiclePlate((data.vehicle_plate as string) || '');
      setCapacity((data.capacity_kg as number) ?? '');
    }
  }, [data]);
  return (
    <RoleGuard allow={['CARRIER','ADMIN']}>
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-3">Perfil de Transportista</h2>
        <div className="space-y-2">
          <input className="border w-full px-2 py-1 rounded" placeholder="Placa" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} />
          <input type="number" className="border w-full px-2 py-1 rounded" placeholder="Capacidad (kg)" value={capacity} onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : '')} />
          <button onClick={() => mutation.mutate()} className="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </div>
    </RoleGuard>
  );
};


