import { create } from 'zustand';

interface UiState {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openMobileMenu: () => void;
}

/**
 * Zustand Store: useUiStore
 * Handles lightweight, global client-side UI states,
 * such as the responsiveness of the mobile navigation drawer.
 */
export const useUiStore = create<UiState>((set) => ({
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
}));
