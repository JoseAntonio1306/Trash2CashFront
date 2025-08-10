import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { paymentsAPI, mapHttpError } from '../services/api';
import { RoleGuard } from '../components/RoleGuard';

export const PaymentHoldForm: React.FC = () => {
  const [allocationId, setAllocationId] = React.useState<number>(0);
  const mutation = useMutation({
    mutationFn: () => paymentsAPI.hold({ allocation_id: allocationId }),
    onSuccess: () => alert('Pago en hold'),
    onError: (e) => alert(mapHttpError(e).message),
  });
  return (
    <RoleGuard allow={['REC','ADMIN']}>
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-3">Escrow Hold</h2>
        <div className="space-y-2">
          <input type="number" className="border w-full px-2 py-1 rounded" placeholder="Allocation ID" value={allocationId} onChange={(e) => setAllocationId(Number(e.target.value))} />
          <button onClick={() => mutation.mutate()} className="bg-blue-600 text-white px-4 py-2 rounded">Hold</button>
        </div>
      </div>
    </RoleGuard>
  );
};

export const PaymentReleaseForm: React.FC = () => {
  const [paymentId, setPaymentId] = React.useState<number>(0);
  const mutation = useMutation({
    mutationFn: () => paymentsAPI.release({ payment_id: paymentId }),
    onSuccess: () => alert('Pago liberado'),
    onError: (e) => alert(mapHttpError(e).message),
  });
  return (
    <RoleGuard allow={['ADMIN']}>
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-3">Liberar Escrow</h2>
        <div className="space-y-2">
          <input type="number" className="border w-full px-2 py-1 rounded" placeholder="Payment ID" value={paymentId} onChange={(e) => setPaymentId(Number(e.target.value))} />
          <button onClick={() => mutation.mutate()} className="bg-green-600 text-white px-4 py-2 rounded">Release</button>
        </div>
      </div>
    </RoleGuard>
  );
};


