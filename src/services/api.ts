import axios from 'axios';
import { User, Lot, Offer, ESGMetrics } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'generador1@example.com',
    role: 'GEN',
    companyName: 'EcoPlast Bolivia',
    nit: '1234567890',
    location: 'La Paz',
    rating: 4.5,
    verified: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    email: 'recicladora1@example.com',
    role: 'REC',
    companyName: 'ReciclaMax',
    nit: '0987654321',
    location: 'Santa Cruz',
    rating: 4.8,
    verified: true,
    createdAt: '2024-01-10',
  },
];

const mockLots: Lot[] = [
  {
    id: '1',
    ownerId: '1',
    ownerName: 'EcoPlast Bolivia',
    material: 'plastico',
    subtype: 'PET',
    qtyKg: 500,
    quality: 'alta',
    priceAskPerTon: 1200,
    photos: ['https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg'],
    city: 'La Paz',
    needsTransport: true,
    status: 'open',
    description: 'Botellas PET limpias y clasificadas',
    createdAt: '2024-01-20',
    featured: true,
  },
  {
    id: '2',
    ownerId: '1',
    ownerName: 'EcoPlast Bolivia',
    material: 'carton',
    subtype: 'Corrugado',
    qtyKg: 800,
    quality: 'media',
    priceAskPerTon: 800,
    photos: ['https://images.pexels.com/photos/4099354/pexels-photo-4099354.jpeg'],
    city: 'Cochabamba',
    needsTransport: false,
    status: 'open',
    description: 'Cartón corrugado de embalajes',
    createdAt: '2024-01-19',
  },
];

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<User> => {
    // Mock login
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = mockUsers.find(u => u.email === email);
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  },
  
  register: async (userData: Partial<User> & { password: string }): Promise<User> => {
    // Mock register
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      role: userData.role!,
      companyName: userData.companyName!,
      nit: userData.nit!,
      location: userData.location!,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  },
};

// Lots API
export const lotsAPI = {
  getLots: async (filters?: any): Promise<Lot[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let filteredLots = [...mockLots];
    
    if (filters?.material) {
      filteredLots = filteredLots.filter(lot => lot.material === filters.material);
    }
    if (filters?.city) {
      filteredLots = filteredLots.filter(lot => 
        lot.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    
    return filteredLots;
  },
  
  getLot: async (id: string): Promise<Lot> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lot = mockLots.find(l => l.id === id);
    if (!lot) throw new Error('Lote no encontrado');
    return lot;
  },
  
  createLot: async (lotData: Omit<Lot, 'id' | 'createdAt'>): Promise<Lot> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newLot: Lot = {
      ...lotData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    mockLots.unshift(newLot);
    return newLot;
  },
};

// Offers API
export const offersAPI = {
  createOffer: async (offerData: Omit<Offer, 'id' | 'createdAt'>): Promise<Offer> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newOffer: Offer = {
      ...offerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    return newOffer;
  },
  
  getOffersByLot: async (lotId: string): Promise<Offer[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Mock offers
    return [
      {
        id: '1',
        lotId,
        bidderId: '2',
        bidderName: 'ReciclaMax',
        pricePerTon: 1300,
        pickupDate: '2024-01-25',
        note: 'Podemos recoger la próxima semana',
        status: 'pending',
        createdAt: '2024-01-21',
      },
    ];
  },
};

// ESG API
export const esgAPI = {
  getMetrics: async (): Promise<ESGMetrics> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      totalKgDiverted: 15420,
      co2SavedKg: 3084,
      operationsCompleted: 47,
      materialBreakdown: {
        plastico: 6500,
        carton: 4200,
        chatarra: 2800,
        'e-waste': 1200,
        vidrio: 520,
        papel: 200,
      },
      monthlyTrend: [
        { month: 'Oct', kg: 2100, co2: 420 },
        { month: 'Nov', kg: 3200, co2: 640 },
        { month: 'Dic', kg: 4800, co2: 960 },
        { month: 'Ene', kg: 5320, co2: 1064 },
      ],
    };
  },
};