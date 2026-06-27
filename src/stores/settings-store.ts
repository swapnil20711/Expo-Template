import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ColorSchemePreference = 'system' | 'light' | 'dark';

type SettingsState = {
  /** User's theme choice. `system` follows the OS. Synced to NativeWind in `providers.tsx`. */
  colorScheme: ColorSchemePreference;
  /** Whether persisted state has loaded from storage — useful to avoid a theme flash. */
  hasHydrated: boolean;
  setColorScheme: (value: ColorSchemePreference) => void;
};

/**
 * Example Zustand store, persisted with AsyncStorage (universal — works on iOS, Android, and web).
 * Add your own client-side state here; use TanStack Query for server state instead.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      colorScheme: 'system',
      hasHydrated: false,
      setColorScheme: (value) => set({ colorScheme: value }),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ colorScheme }) => ({ colorScheme }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);
