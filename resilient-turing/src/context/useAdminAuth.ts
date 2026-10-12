"use client";

import { create } from 'zustand';
import { AdminUser } from '../types';

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

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: pass }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.authenticated && data.user) {
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            loginError: null,
          });
          if (typeof window !== 'undefined') {
            localStorage.setItem('admin_static_auth', JSON.stringify(data.user));
          }
          return true;
        }
      }
    } catch {
      // Fallback to client-side static auth check
    }

    // Client-side fallback authentication for static hosting (Hostinger shared hosting)
    const cleanEmail = email.trim().toLowerCase();
    const validUsernames = ['admin', 'ayman', 'eng.ayman@hedabkh.com.sa', 'admin@hedabkh.com.sa'];
    const validPasswords = ['Password123!', 'admin123'];

    if ((validUsernames.includes(cleanEmail) || cleanEmail.includes('admin') || cleanEmail.includes('ayman')) && validPasswords.includes(pass)) {
      const fallbackUser: AdminUser = {
        id: 'usr_admin_sovereign',
        email: cleanEmail.includes('@') ? cleanEmail : 'admin@hedabkh.com.sa',
        name: 'م. أيمن جميل الحاتم',
        role: 'super_admin',
        permissions: ['projects_manage', 'certificates_manage', 'services_manage', 'inquiries_view_reply', 'statistics_manage', 'team_manage', 'settings_manage', 'users_manage', 'logs_view', 'design_manage', 'media_manage'],
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      set({
        user: fallbackUser,
        isAuthenticated: true,
        isLoading: false,
        loginError: null,
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_static_auth', JSON.stringify(fallbackUser));
      }
      return true;
    }

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      loginError: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    });
    return false;
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network failure on logout
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_static_auth');
    }
    set({ user: null, isAuthenticated: false, isLoading: false, loginError: null });
  },

  checkSession: async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.authenticated && data.user) {
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }
      }
    } catch {
      // Fallback to static localStorage check
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('admin_static_auth');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch {
          localStorage.removeItem('admin_static_auth');
        }
      }
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
