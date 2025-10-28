import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Role, Catedratico, Recepcionista } from '../types';
import { STORAGE_KEYS } from '../constants';

interface AuthState {
  user: User | null;
  role: Role | null;
  catedratico: Catedratico | null;
  recepcionista: Recepcionista | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setRole: (role: Role | null) => void;
  setCatedratico: (catedratico: Catedratico | null) => void;
  setRecepcionista: (recepcionista: Recepcionista | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAuthData: (authResponse: {
    user: User;
    role: Role;
    catedratico: Catedratico | null;
    recepcionista: Recepcionista | null;
    token: string;
    refreshToken: string;
  }) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      catedratico: null,
      recepcionista: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: User | null) =>
        set((state) => ({
          ...state,
          user,
          isAuthenticated: !!user,
        })),

      setRole: (role: Role | null) =>
        set((state) => ({
          ...state,
          role,
        })),

      setCatedratico: (catedratico: Catedratico | null) =>
        set((state) => ({
          ...state,
          catedratico,
        })),

      setRecepcionista: (recepcionista: Recepcionista | null) =>
        set((state) => ({
          ...state,
          recepcionista,
        })),

      setTokens: (accessToken: string, refreshToken: string) =>
        set((state) => ({
          ...state,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        })),

      setAuthData: (authResponse) =>
        set({
          user: authResponse.user,
          role: authResponse.role,
          catedratico: authResponse.catedratico,
          recepcionista: authResponse.recepcionista,
          accessToken: authResponse.token,
          refreshToken: authResponse.refreshToken,
          isAuthenticated: true,
          isLoading: false,
        }),

      clearAuth: () =>
        set({
          user: null,
          role: null,
          catedratico: null,
          recepcionista: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (isLoading: boolean) =>
        set((state) => ({
          ...state,
          isLoading,
        })),
    }),
    {
      name: STORAGE_KEYS.USER, // Storage key
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        catedratico: state.catedratico,
        recepcionista: state.recepcionista,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);