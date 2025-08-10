import axios, { AxiosError } from 'axios';
import type { components } from '../types/openapi.d';

// Base URL: prioriza NEXT_PUBLIC_API_BASE_URL si existe; por defecto FastAPI local
const API_BASE_URL =
  // Vite sólo expone variables que empiezan con VITE_, así que ofrecemos varios fallbacks
  (import.meta.env as any).NEXT_PUBLIC_API_BASE_URL ||
  (import.meta.env as any).VITE_API_BASE_URL ||
  'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para adjuntar JWT si existe
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('t2c_token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper: mapeo de errores HTTP a mensajes UX (ES)
export function mapHttpError(error: unknown): { status?: number; message: string } {
  const defaultMsg = 'Ocurrió un error. Intenta nuevamente.';
  if (!axios.isAxiosError(error)) return { message: defaultMsg };
  const status = error.response?.status;
  // Extrae mensajes detallados de FastAPI (detail puede ser string o array de objetos {msg})
  const detail = (error.response?.data as any)?.detail;
  let detailedMsg: string | null = null;
  if (typeof detail === 'string') detailedMsg = detail;
  if (Array.isArray(detail)) {
    const msgs = detail
      .map((d) => (typeof d === 'string' ? d : d?.msg))
      .filter(Boolean);
    if (msgs.length) detailedMsg = msgs.join('\n');
  }
  const message =
    detailedMsg ||
    (status === 401
      ? 'No autenticado. Inicia sesión.'
      : status === 403
      ? 'No tienes permisos para esta acción.'
      : status === 404
      ? 'Recurso no encontrado.'
      : status === 409
      ? 'Conflicto: transición/estado no válido o stock insuficiente.'
      : status === 422
      ? 'Datos inválidos. Revisa el formulario.'
      : defaultMsg);
  return { status, message };
}

// Tipos derivados de OpenAPI
export type UserOut = components['schemas']['UserOut'];
export type TokenOut = components['schemas']['TokenOut'];
export type RegisterOut = components['schemas']['RegisterOut'];
export type LotCreate = components['schemas']['LotCreate'];
export type LotOut = components['schemas']['LotOut'];
export type LotStatusUpdate = components['schemas']['LotStatusUpdate'];
export type LotPhotoCreate = components['schemas']['LotPhotoCreate'];
export type LotPropCreate = components['schemas']['LotPropCreate'];
export type OfferCreate = components['schemas']['OfferCreate'];
export type OfferOut = components['schemas']['OfferOut'];
export type OfferStatusUpdate = components['schemas']['OfferStatusUpdate'];
export type AllocationCreateFixed = components['schemas']['AllocationCreateFixed'];
export type AllocationOut = components['schemas']['AllocationOut'];
export type PaymentHoldRequest = components['schemas']['PaymentHoldRequest'];
export type PaymentActionRequest = components['schemas']['PaymentActionRequest'];
export type PaymentOut = components['schemas']['PaymentOut'];
export type DealOut = components['schemas']['DealOut'];
export type ShipmentQuoteRequest = components['schemas']['ShipmentQuoteRequest'];
export type ShipmentQuoteOut = components['schemas']['ShipmentQuoteOut'];
export type ShipmentCreate = components['schemas']['ShipmentCreate'];
export type ShipmentOut = components['schemas']['ShipmentOut'];
export type ShipmentStatusUpdate = components['schemas']['ShipmentStatusUpdate'];

// Auth API
export const authAPI = {
  async login(email: string, password: string): Promise<TokenOut> {
    const { data } = await api.post<TokenOut>('/auth/login', { email, password });
    return data;
  },
  async register(params: { email: string; password: string; role_global?: 'GEN' | 'REC' | 'CARRIER' | 'ADMIN'; company_id?: number | null; company_name?: string | null; company_city?: string | null }): Promise<RegisterOut> {
    const { data } = await api.post<RegisterOut>('/auth/register', {
      email: params.email,
      password: params.password,
      role_global: params.role_global ?? 'GEN',
      company_id: params.company_id ?? null,
      company_name: params.company_name ?? null,
      company_city: params.company_city ?? null,
    });
    return data;
  },
  async me(): Promise<UserOut> {
    const { data } = await api.get<UserOut>('/me');
    return data;
  },
};

// Health
export const healthAPI = {
  async healthz(): Promise<any> {
    const { data } = await api.get('/healthz');
    return data;
  },
};

// Companies & Roles
export const companiesAPI = {
  async createCompany(payload: { name: string; city?: string | null }) {
    const { data } = await api.post('/companies', payload);
    return data as components['schemas']['CompanyOut'];
  },
  async getCompany(companyId: number) {
    const { data } = await api.get(`/companies/${companyId}`);
    return data as components['schemas']['CompanyOut'];
  },
  async updateCompany(companyId: number, payload: { name?: string | null; city?: string | null }) {
    const { data } = await api.patch(`/companies/${companyId}`, payload);
    return data as components['schemas']['CompanyOut'];
  },
  async assignRole(payload: { user_id: number; company_id: number; role: 'GEN' | 'REC' | 'CARRIER' | 'ADMIN' }) {
    const { data } = await api.post('/company-roles', payload);
    return data as components['schemas']['CompanyRoleOut'];
  },
  async removeRole(payload: { user_id: number; company_id: number; role: 'GEN' | 'REC' | 'CARRIER' | 'ADMIN' }) {
    await api.delete('/company-roles', { data: payload });
  },
};

// Carrier Profile
export const carrierAPI = {
  async getMyProfile() {
    const { data } = await api.get('/carriers/profile');
    return data as components['schemas']['CarrierProfileOut'];
  },
  async upsertProfile(payload: { vehicle_plate?: string | null; capacity_kg?: number | null }) {
    const { data } = await api.post('/carriers/profile', payload);
    return data as components['schemas']['CarrierProfileOut'];
  },
};

// Lots
export const lotsAPI = {
  async list(params?: { material?: string | null; city?: string | null; status?: string | null; limit?: number; offset?: number }) {
    const { data } = await api.get<LotOut[]>('/lots', { params });
    return data;
  },
  async get(lotId: number) {
    const { data } = await api.get<LotOut>(`/lots/${lotId}`);
    return data;
  },
  async create(payload: LotCreate) {
    const { data } = await api.post<LotOut>('/lots', payload);
    return data;
  },
  async updateStatus(lotId: number, payload: LotStatusUpdate) {
    const { data } = await api.patch<LotOut>(`/lots/${lotId}`, payload);
    return data;
  },
  async addPhoto(lotId: number, payload: LotPhotoCreate) {
    await api.post(`/lots/${lotId}/photos`, payload);
  },
  async addProp(lotId: number, payload: LotPropCreate) {
    await api.post(`/lots/${lotId}/props`, payload);
  },
};

// Offers
export const offersAPI = {
  async create(payload: OfferCreate) {
    const { data } = await api.post<OfferOut>('/offers', payload);
    return data;
  },
  async updateStatus(offerId: number, payload: OfferStatusUpdate) {
    const { data } = await api.patch<OfferOut>(`/offers/${offerId}`, payload);
    return data;
  },
};

// Allocations
export const allocationsAPI = {
  async createFixed(payload: AllocationCreateFixed) {
    const { data } = await api.post<AllocationOut>('/allocations', payload);
    return data;
  },
  async cancel(allocationId: number, payload?: { reason?: string | null }) {
    const { data } = await api.patch<AllocationOut>(`/allocations/${allocationId}/cancel`, payload ?? {});
    return data;
  },
};

// Payments (Escrow)
export const paymentsAPI = {
  async hold(payload: PaymentHoldRequest) {
    const { data } = await api.post<PaymentOut>('/payments/hold', payload);
    return data;
  },
  async release(payload: PaymentActionRequest) {
    const { data } = await api.post<PaymentOut>('/payments/release', payload);
    return data;
  },
};

// Deals
export const dealsAPI = {
  async get(dealId: number) {
    const { data } = await api.get<DealOut>(`/deals/${dealId}`);
    return data;
  },
  async getByAllocation(allocationId: number) {
    const { data } = await api.get<DealOut>(`/allocations/${allocationId}/deal`);
    return data;
  },
};

// Shipments
export const shipmentsAPI = {
  async quote(payload: ShipmentQuoteRequest) {
    const { data } = await api.post<ShipmentQuoteOut>('/shipments/quote', payload);
    return data;
  },
  async create(payload: ShipmentCreate) {
    const { data } = await api.post<ShipmentOut>('/shipments', payload);
    return data;
  },
  async updateStatus(shipmentId: number, payload: ShipmentStatusUpdate) {
    const { data } = await api.patch<ShipmentOut>(`/shipments/${shipmentId}/status`, payload);
    return data;
  },
};
