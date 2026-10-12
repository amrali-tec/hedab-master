import { create } from 'zustand';
import { AdminUser } from '../types';
import { authApi } from '../services/authApi';

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginError: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  clearError: () => void;
}

export const useAdminAuth = create<AdminAuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  loginError: null,

  login: async (email: string, pass: string): Promise<boolean> => {
    set({ loginError: null, isLoading: true });

    const result = await authApi.login(email, pass);

    if (result.success && result.user) {
      set({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
        loginError: null,
      });
      return true;
    }

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      loginError: result.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    });
    return false;
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, isAuthenticated: false, isLoading: false, loginError: null });
  },

  checkSession: async (): Promise<boolean> => {
    const result = await authApi.checkSession();
    if (result.authenticated && result.user) {
      set({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    return false;
  },

  clearError: () => set({ loginError: null }),
}));

