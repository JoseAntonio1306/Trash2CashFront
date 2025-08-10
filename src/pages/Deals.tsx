import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dealsAPI, mapHttpError } from '../services/api';

export const DealView: React.FC<{ dealId: number }> = ({ dealId }) => {
  const { data, error, isLoading } = useQuery({ queryKey: ['deal', dealId], queryFn: () => dealsAPI.get(dealId) });
  if (isLoading) return <div className="p-6">Cargando...</div>;
  if (error) return <div className="p-6 text-red-600">{mapHttpError(error).message}</div>;
  if (!data) return null;
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-3">Deal #{data.id}</h1>
      <div className="space-y-1 text-sm">
        <div>Qty: {data.qty_kg} kg</div>
        <div>Precio/Ton: {data.unit_price_per_ton}</div>
        <div>Subtotal: {data.subtotal_amount}</div>
        <div>Fee venta: {data.sale_fee_amount}</div>
        <div>Fee transporte: {data.transport_fee_amount}</div>
        <div>Estado: {data.status}</div>
        <div>Creado: {new Date(data.created_at).toLocaleString()}</div>
      </div>
    </div>
  );
};


