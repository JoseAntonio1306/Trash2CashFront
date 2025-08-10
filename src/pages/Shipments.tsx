import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { shipmentsAPI, mapHttpError } from '../services/api';
import { RoleGuard } from '../components/RoleGuard';

export const ShipmentQuoteForm: React.FC = () => {
  const [dealId, setDealId] = React.useState<number>(0);
  const [result, setResult] = React.useState<string>('');
  const mutation = useMutation({
    mutationFn: () => shipmentsAPI.quote({ deal_id: dealId }),
    onSuccess: (data) => setResult(`${data.km_est} km · ${data.quoted_cost} · ETA ${new Date(data.eta_at).toLocaleString()}`),
    onError: (e) => setResult(mapHttpError(e).message),
  });
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-3">Cotizar Envío</h2>
      <div className="space-y-2">
        <input type="number" className="border w-full px-2 py-1 rounded" placeholder="Deal ID" value={dealId} onChange={(e) => setDealId(Number(e.target.value))} />
        <button onClick={() => mutation.mutate()} className="bg-blue-600 text-white px-4 py-2 rounded">Cotizar</button>
        {result && <div className="mt-2 text-sm">{result}</div>}
      </div>
    </div>
  );
};

export const ShipmentCreateForm: React.FC = () => {
  const [dealId, setDealId] = React.useState<number>(0);
  const [carrierCompanyId, setCarrierCompanyId] = React.useState<number>(0);
  const mutation = useMutation({
    mutationFn: () => shipmentsAPI.create({ deal_id: dealId, carrier_company_id: carrierCompanyId }),
    onSuccess: () => alert('Envío creado'),
    onError: (e) => alert(mapHttpError(e).message),
  });
  return (
    <RoleGuard allow={['REC','GEN','ADMIN']}>
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-3">Crear Envío</h2>
        <div className="space-y-2">
          <input type="number" className="border w-full px-2 py-1 rounded" placeholder="Deal ID" value={dealId} onChange={(e) => setDealId(Number(e.target.value))} />
          <input type="number" className="border w-full px-2 py-1 rounded" placeholder="Carrier Company ID" value={carrierCompanyId} onChange={(e) => setCarrierCompanyId(Number(e.target.value))} />
          <button onClick={() => mutation.mutate()} className="bg-green-600 text-white px-4 py-2 rounded">Crear</button>
        </div>
      </div>
    </RoleGuard>
  );
};

export const ShipmentStatusForm: React.FC = () => {
  const [shipmentId, setShipmentId] = React.useState<number>(0);
  const [status, setStatus] = React.useState<'assigned'|'picked'|'in_transit'|'delivered'>('assigned');
  const [finalCost, setFinalCost] = React.useState<number | ''>('');
  const mutation = useMutation({
    mutationFn: () => shipmentsAPI.updateStatus(shipmentId, { status, final_cost: status === 'delivered' ? (finalCost === '' ? null : Number(finalCost)) : null }),
    onSuccess: () => alert('Estado actualizado'),
    onError: (e) => alert(mapHttpError(e).message),
  });
  return (
    <RoleGuard allow={['CARRIER','ADMIN']}>
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-3">Actualizar Estado de Envío</h2>
        <div className="space-y-2">
          <input type="number" className="border w-full px-2 py-1 rounded" placeholder="Shipment ID" value={shipmentId} onChange={(e) => setShipmentId(Number(e.target.value))} />
          <select className="border w-full px-2 py-1 rounded" value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="assigned">assigned</option>
            <option value="picked">picked</option>
            <option value="in_transit">in_transit</option>
            <option value="delivered">delivered</option>
          </select>
          {status === 'delivered' ? (
            <input type="number" step="0.01" className="border w-full px-2 py-1 rounded" placeholder="Costo final" value={finalCost} onChange={(e) => setFinalCost(e.target.value ? Number(e.target.value) : '')} />
          ) : null}
          <button onClick={() => mutation.mutate()} className="bg-purple-600 text-white px-4 py-2 rounded">Actualizar</button>
        </div>
      </div>
    </RoleGuard>
  );
};


