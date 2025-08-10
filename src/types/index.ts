// roles disponibles en la app
export const USER_ROLES = ['GEN', 'REC', 'CARRIER', 'ADMIN'] as const;
export type UserRole = typeof USER_ROLES[number];

// si en el registro NO quieres permitir ADMIN, define una lista para registro
export const REGISTER_ROLES = ['GEN', 'REC'] as const;
export type RegisterRole = typeof REGISTER_ROLES[number];

// (todo lo demás igual que ya tienes)


// Tipos locales antiguos se mantienen sólo si alguna vista los usa.
// Para auth y entidades, ahora usamos los tipos del OpenAPI desde services/api.

export type MaterialType = 'plastico' | 'carton' | 'chatarra' | 'e-waste' | 'vidrio' | 'papel';
export type QualityType = 'alta' | 'media' | 'mixta';
export type LotStatus = 'open' | 'matched' | 'in_transit' | 'completed' | 'cancelled';

export interface Lot {
  id: string;
  ownerId: string;
  ownerName: string;
  material: MaterialType;
  subtype?: string;
  qtyKg: number;
  quality: QualityType;
  priceAskPerTon: number;
  photos: string[];
  city: string;
  geo?: { lat: number; lng: number };
  needsTransport: boolean;
  status: LotStatus;
  description?: string;
  createdAt: string;
  featured?: boolean;
}

export type OfferStatus = 'pending' | 'accepted' | 'rejected';

export interface Offer {
  id: string;
  lotId: string;
  bidderId: string;
  bidderName: string;
  pricePerTon: number;
  pickupDate: string;
  note?: string;
  status: OfferStatus;
  createdAt: string;
}

export type ShipmentStatus = 'requested' | 'assigned' | 'picked' | 'delivered';

export interface Shipment {
  id: string;
  lotId: string;
  carrierId: string;
  carrierName: string;
  km: number;
  cost: number;
  scheduledAt: string;
  status: ShipmentStatus;
}

export type PaymentStatus = 'held' | 'released' | 'refunded';

export interface Payment {
  id: string;
  lotId: string;
  payerId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
}

export interface Certificate {
  id: string;
  lotId: string;
  pdfUrl: string;
  co2SavedKg: number;
  issuedAt: string;
}

export interface ESGMetrics {
  totalKgDiverted: number;
  co2SavedKg: number;
  operationsCompleted: number;
  materialBreakdown: Record<MaterialType, number>;
  monthlyTrend: Array<{ month: string; kg: number; co2: number }>;
}