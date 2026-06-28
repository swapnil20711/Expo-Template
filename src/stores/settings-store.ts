import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ColorSchemePreference = 'system' | 'light' | 'dark';
export type AppLanguage = 'en' | 'ar';

const deviceLanguage: AppLanguage = getLocales()[0]?.languageCode === 'ar' ? 'ar' : 'en';

type SettingsState = {
  /** User's theme choice. `system` follows the OS. Synced to NativeWind in `providers.tsx`. */
  colorScheme: ColorSchemePreference;
  /** Active language. Synced to i18next + RTL in `providers.tsx`. Defaults to the device locale. */
  language: AppLanguage;
  /** Whether persisted state has loaded from storage — useful to avoid a theme/lang flash. */
  hasHydrated: boolean;
  setColorScheme: (value: ColorSchemePreference) => void;
  setLanguage: (value: AppLanguage) => void;
};

/**
 * Example Zustand store, persisted with AsyncStorage (universal — works on iOS, Android, and web).
 * Add your own client-side state here; use TanStack Query for server state instead.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      colorScheme: 'system',
      language: deviceLanguage,
      hasHydrated: false,
      setColorScheme: (value) => set({ colorScheme: value }),
      setLanguage: (value) => set({ language: value }),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ colorScheme, language }) => ({ colorScheme, language }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);
