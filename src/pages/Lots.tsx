import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lotsAPI, mapHttpError, LotOut, LotCreate } from '../services/api';
import { RoleGuard } from '../components/RoleGuard';

export const LotsList: React.FC = () => {
  const [material, setMaterial] = React.useState<string>('');
  const [city, setCity] = React.useState<string>('');
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['lots', { material, city }],
    queryFn: () => lotsAPI.list({ material: material || null, city: city || null }),
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <a href="/publish" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Publicar Lote</a>
        </div>
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Material" className="border px-3 py-2 rounded-lg" />
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ciudad" className="border px-3 py-2 rounded-lg" />
            <button onClick={() => refetch()} className="bg-gray-900 text-white px-4 py-2 rounded-lg">Filtrar</button>
          </div>
        </div>
        {isLoading ? <div className="text-center">Cargando...</div> : null}
        {error ? <div className="text-center text-red-600">Error cargando lotes</div> : null}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((l: LotOut) => (
            <a key={l.id} href={`/lots/${l.id}`} className="block bg-white rounded-xl shadow hover:shadow-lg transition p-5">
              <div className="text-sm text-gray-500">{l.city || '—'}</div>
              <div className="text-xl font-semibold text-gray-900">{l.material}</div>
              <div className="mt-2 text-gray-600">Disponible: {l.available_qty_kg} kg</div>
              <div className="mt-1 text-gray-600">Precio/ton: {l.unit_price_per_ton ?? (l.price_mode === 'negotiable' ? 'Negociable' : '—')}</div>
              <div className="mt-3">
                <span className="inline-block text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{l.price_mode}</span>
                {l.allow_partial ? <span className="inline-block text-xs ml-2 px-2 py-1 rounded bg-green-100 text-green-700">Parcial</span> : null}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LotCreateForm: React.FC = () => {
  const qc = useQueryClient();
  const [form, setForm] = React.useState<LotCreate>({ material: '', total_qty_kg: 1, price_mode: 'fixed', unit_price_per_ton: null, allow_partial: false, min_chunk_kg: null, step_kg: null, city: '', reserve_ttl_minutes: 60 });
  const mutation = useMutation({
    mutationFn: (payload: LotCreate) => lotsAPI.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lots'] });
      alert('Lote creado');
    },
    onError: (e) => alert(mapHttpError(e).message),
  });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.allow_partial) {
      if (!form.min_chunk_kg || !form.step_kg) {
        alert('Si permites parcial, min_chunk_kg y step_kg > 0');
        return;
      }
    }
    mutation.mutate(form);
  };
  return (
    <RoleGuard allow={['GEN','ADMIN']}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Crear Lote</h2>
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">Material</label>
              <input className="border w-full px-3 py-2 rounded" placeholder="PET, Cartón, etc." value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ciudad</label>
              <input className="border w-full px-3 py-2 rounded" placeholder="Ciudad" value={form.city ?? ''} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cantidad total (kg)</label>
              <input type="number" className="border w-full px-3 py-2 rounded" value={form.total_qty_kg} onChange={(e) => setForm({ ...form, total_qty_kg: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Modo de precio</label>
              <select className="border w-full px-3 py-2 rounded" value={form.price_mode} onChange={(e) => setForm({ ...form, price_mode: e.target.value as any })}>
                <option value="fixed">Fijo</option>
                <option value="negotiable">Negociable</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Precio por tonelada (opcional)</label>
              <input type="number" step="0.01" className="border w-full px-3 py-2 rounded" placeholder="Ej: 1200" value={form.unit_price_per_ton ?? ''} onChange={(e) => setForm({ ...form, unit_price_per_ton: e.target.value ? Number(e.target.value) : null })} />
            </div>
            <div className="md:col-span-2">
              <label className="flex gap-2 items-center text-sm font-medium">
                <input type="checkbox" checked={form.allow_partial ?? false} onChange={(e) => setForm({ ...form, allow_partial: e.target.checked })} /> Permitir venta parcial
              </label>
            </div>
            {form.allow_partial ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Mínimo por compra (kg)</label>
                  <input type="number" className="border w-full px-3 py-2 rounded" value={form.min_chunk_kg ?? ''} onChange={(e) => setForm({ ...form, min_chunk_kg: e.target.value ? Number(e.target.value) : null })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Incremento (kg)</label>
                  <input type="number" className="border w-full px-3 py-2 rounded" value={form.step_kg ?? ''} onChange={(e) => setForm({ ...form, step_kg: e.target.value ? Number(e.target.value) : null })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Tiempo de reserva (min)</label>
                  <input type="number" className="border w-full px-3 py-2 rounded" value={form.reserve_ttl_minutes ?? 60} onChange={(e) => setForm({ ...form, reserve_ttl_minutes: Number(e.target.value) })} />
                </div>
              </>
            ) : null}
            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" className="px-4 py-2 rounded border">Cancelar</button>
              <button disabled={mutation.isPending} className="bg-green-600 text-white px-4 py-2 rounded">{mutation.isPending ? 'Creando...' : 'Crear Lote'}</button>
            </div>
          </form>
        </div>
      </div>
    </RoleGuard>
  );
};


