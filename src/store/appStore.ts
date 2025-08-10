import { create } from 'zustand';
import { Lot, Offer, MaterialType } from '../types';

interface AppState {
  lots: Lot[];
  offers: Offer[];
  selectedLot: Lot | null;
  filters: {
    material: MaterialType | '';
    city: string;
    maxDistance: number;
  };
  setLots: (lots: Lot[]) => void;
  addLot: (lot: Lot) => void;
  updateLot: (id: string, updates: Partial<Lot>) => void;
  setOffers: (offers: Offer[]) => void;
  addOffer: (offer: Offer) => void;
  updateOffer: (id: string, updates: Partial<Offer>) => void;
  setSelectedLot: (lot: Lot | null) => void;
  setFilters: (filters: Partial<AppState['filters']>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  lots: [],
  offers: [],
  selectedLot: null,
  filters: {
    material: '',
    city: '',
    maxDistance: 50,
  },
  setLots: (lots) => set({ lots }),
  addLot: (lot) => set((state) => ({ lots: [lot, ...state.lots] })),
  updateLot: (id, updates) =>
    set((state) => ({
      lots: state.lots.map((lot) => (lot.id === id ? { ...lot, ...updates } : lot)),
    })),
  setOffers: (offers) => set({ offers }),
  addOffer: (offer) => set((state) => ({ offers: [offer, ...state.offers] })),
  updateOffer: (id, updates) =>
    set((state) => ({
      offers: state.offers.map((offer) => (offer.id === id ? { ...offer, ...updates } : offer)),
    })),
  setSelectedLot: (selectedLot) => set({ selectedLot }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
}));