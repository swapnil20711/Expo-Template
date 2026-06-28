import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { useEffect, type ReactNode } from 'react';

import i18n from '@/libs/i18n';
import { env } from '@/lib/env';
import { queryClient } from '@/lib/query-client';
import { useSettingsStore } from '@/stores/settings-store';

/** Pushes the persisted theme preference into NativeWind, the single source of color scheme. */
function ColorSchemeSync() {
  const preference = useSettingsStore((state) => state.colorScheme);
  const { setColorScheme } = useNativeWindColorScheme();

  useEffect(() => {
    setColorScheme(preference);
  }, [preference, setColorScheme]);

  return null;
}

/**
 * Applies the persisted language to i18next on startup. RTL direction is handled by
 * `changeAppLanguage` at the moment the user switches (it persists natively), so this sync is
 * intentionally side-effect-free beyond updating the active translation — no reload here.
 */
function LanguageSync() {
  const language = useSettingsStore((state) => state.language);
  const hasHydrated = useSettingsStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language, hasHydrated]);

  return null;
}

/**
 * App-wide client providers. The Clerk provider is only mounted once a publishable key is
 * configured (see `lib/env.ts`), so the template runs before you connect auth.
 */
export function Providers({ children }: { children: ReactNode }) {
  const content = (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeSync />
      <LanguageSync />
      {children}
    </QueryClientProvider>
  );

  if (!env.clerkPublishableKey) return content;

  return (
    <ClerkProvider publishableKey={env.clerkPublishableKey} tokenCache={tokenCache}>
      {content}
    </ClerkProvider>
  );
}
