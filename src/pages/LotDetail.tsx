import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { lotsAPI, allocationsAPI, offersAPI, mapHttpError } from '../services/api';
import { RoleGuard } from '../components/RoleGuard';

export const LotDetail: React.FC = () => {
  const { id } = useParams();
  const lotId = Number(id);
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['lot', lotId], queryFn: () => lotsAPI.get(lotId), enabled: !Number.isNaN(lotId) });
  const [qty, setQty] = React.useState<number | ''>('');
  const [offerPrice, setOfferPrice] = React.useState<number | ''>('');
  const allocMut = useMutation({
    mutationFn: () => allocationsAPI.createFixed({ lot_id: lotId, qty_kg: Number(qty) }),
    onSuccess: () => { alert('Reserva creada'); refetch(); },
    onError: (e) => alert(mapHttpError(e).message),
  });
  const offerMut = useMutation({
    mutationFn: () => offersAPI.create({ lot_id: lotId, price_per_ton: Number(offerPrice), qty_kg_optional: qty === '' ? null : Number(qty) }),
    onSuccess: () => { alert('Oferta enviada'); },
    onError: (e) => alert(mapHttpError(e).message),
  });

  if (isLoading) return <div className="p-6">Cargando...</div>;
  if (error || !data) return <div className="p-6 text-red-600">{mapHttpError(error).message}</div>;

  const canPartial = data.allow_partial;
  const minChunk = data.min_chunk_kg ?? 0;
  const step = data.step_kg ?? 1;
  const available = data.available_qty_kg;
  const priceMode = data.price_mode;

  const validateQty = (q: number) => {
    if (q <= 0) return 'Cantidad inválida';
    if (canPartial) {
      if (q < minChunk) return `Mínimo ${minChunk} kg`;
      if (q % step !== 0) return `Debe ser múltiplo de ${step} kg`;
    } else {
      if (q !== data.total_qty_kg) return `Debe comprar el 100% (${data.total_qty_kg} kg)`;
    }
    if (q > available) return `Excede disponible (${available} kg)`;
    return null;
  };

  const onReserve = () => {
    if (qty === '') return alert('Ingresa cantidad');
    const err = validateQty(Number(qty));
    if (err) return alert(err);
    allocMut.mutate();
  };

  const onOffer = () => {
    if (offerPrice === '' || Number(offerPrice) <= 0) return alert('Precio inválido');
    if (qty !== '') {
      const err = validateQty(Number(qty));
      if (err) return alert(err);
    }
    offerMut.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{data.material}</h1>
            <div className="text-gray-600">{data.city || '—'}</div>
            <div className="mt-2 text-gray-700">Disponible: {data.available_qty_kg} kg</div>
            <div className="mt-1 text-gray-700">Modo: {data.price_mode}</div>
            <div className="mt-1 text-gray-700">Precio/ton: {data.unit_price_per_ton ?? (priceMode === 'negotiable' ? 'Negociable' : '—')}</div>
            {canPartial ? (
              <div className="mt-2 text-sm text-gray-600">Parcial: mínimo {minChunk} kg, paso {step} kg. TTL: {data.reserve_ttl_minutes} min</div>
            ) : null}
          </div>
          <div className="space-x-2">
            <span className="inline-block text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{data.status}</span>
            {canPartial ? <span className="inline-block text-xs px-2 py-1 rounded bg-green-100 text-green-700">Parcial</span> : null}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Comprar/Reservar (precio fijo) */}
          {priceMode === 'fixed' && (
            <RoleGuard allow={['REC','ADMIN']}>
              <div className="border rounded-lg p-4">
                <h2 className="font-semibold mb-2">Comprar ahora</h2>
                <label className="block text-sm mb-1">Cantidad (kg)</label>
                <input type="number" className="border w-full px-3 py-2 rounded" value={qty} onChange={(e) => setQty(e.target.value ? Number(e.target.value) : '')} />
                <button onClick={onReserve} className="mt-3 bg-green-600 text-white px-4 py-2 rounded">Reservar</button>
                <p className="text-xs text-gray-500 mt-2">Reserva por {data.reserve_ttl_minutes} min para realizar el pago (escrow)</p>
              </div>
            </RoleGuard>
          )}

          {/* Ofertar (negociable) */}
          {priceMode === 'negotiable' && (
            <RoleGuard allow={['REC','ADMIN']}>
              <div className="border rounded-lg p-4">
                <h2 className="font-semibold mb-2">Enviar oferta</h2>
                <label className="block text-sm mb-1">Precio por tonelada</label>
                <input type="number" step="0.01" className="border w-full px-3 py-2 rounded" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value ? Number(e.target.value) : '')} />
                {canPartial ? (
                  <>
                    <label className="block text-sm mb-1 mt-2">Cantidad (kg, opcional)</label>
                    <input type="number" className="border w-full px-3 py-2 rounded" value={qty} onChange={(e) => setQty(e.target.value ? Number(e.target.value) : '')} />
                  </>
                ) : null}
                <button onClick={onOffer} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Ofertar</button>
              </div>
            </RoleGuard>
          )}
        </div>
      </div>
    </div>
  );
};


