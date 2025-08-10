import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { offersAPI, mapHttpError } from '../services/api';
import { RoleGuard } from '../components/RoleGuard';

export const OfferCreateForm: React.FC = () => {
  const [lotId, setLotId] = React.useState<number>(0);
  const [price, setPrice] = React.useState<number>(0);
  const [qtyOpt, setQtyOpt] = React.useState<number | ''>('');
  const mutation = useMutation({
    mutationFn: () => offersAPI.create({ lot_id: lotId, price_per_ton: price, qty_kg_optional: qtyOpt === '' ? null : Number(qtyOpt) }),
    onSuccess: () => alert('Oferta creada'),
    onError: (e) => alert(mapHttpError(e).message),
  });
  return (
    <RoleGuard allow={['REC','ADMIN']}>
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-3">Crear Oferta</h2>
        <div className="space-y-2">
          <input type="number" className="border w-full px-2 py-1 rounded" placeholder="Lot ID" value={lotId} onChange={(e) => setLotId(Number(e.target.value))} />
          <input type="number" step="0.01" className="border w-full px-2 py-1 rounded" placeholder="Precio por tonelada" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          <input type="number" className="border w-full px-2 py-1 rounded" placeholder="Kg (opcional)" value={qtyOpt} onChange={(e) => setQtyOpt(e.target.value ? Number(e.target.value) : '')} />
          <button onClick={() => mutation.mutate()} className="bg-blue-600 text-white px-4 py-2 rounded">Enviar</button>
        </div>
      </div>
    </RoleGuard>
  );
};


