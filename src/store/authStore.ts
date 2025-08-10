import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserOut } from '../services/api';
import { authAPI } from '../services/api';

interface AuthState {
  user: UserOut | null;
  token: string | null;
  isAuthenticated: boolean;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  registerWithCredentials: (args: { email: string; password: string; role_global?: 'GEN' | 'REC' | 'CARRIER' | 'ADMIN'; company_id?: number | null; company_name?: string | null; company_city?: string | null }) => Promise<void>;
  logout: () => void;
  hydrateMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loginWithCredentials: async (email, password) => {
        const tokenOut = await authAPI.login(email, password);
        localStorage.setItem('t2c_token', tokenOut.token);
        set({ token: tokenOut.token, isAuthenticated: true });
        const me = await authAPI.me();
        set({ user: me });
      },
      registerWithCredentials: async ({ email, password, role_global, company_id, company_name, company_city }) => {
        const reg = await authAPI.register({ email, password, role_global, company_id, company_name, company_city });
        localStorage.setItem('t2c_token', reg.token);
        set({ token: reg.token, isAuthenticated: true });
        const me = await authAPI.me();
        set({ user: me });
      },
      logout: () => {
        localStorage.removeItem('t2c_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      hydrateMe: async () => {
        try {
          const me = await authAPI.me();
          set({ user: me, isAuthenticated: true });
        } catch {
          // token inválido
          localStorage.removeItem('t2c_token');
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    { name: 't2c-auth' }
  )
);