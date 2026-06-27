import { useAuth } from '@clerk/clerk-expo';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppErrorBoundary } from '@/components/error-boundary';
import { Providers } from '@/components/providers';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { isAuthConfigured } from '@/lib/env';

// Keep the native splash up until we know the auth state, so signed-in users never flash the
// sign-in screen while Clerk loads the session from secure storage.
void SplashScreen.preventAutoHideAsync();

// expo-router renders this whenever a route in this segment throws during render.
export { AppErrorBoundary as ErrorBoundary };

/**
 * Auth-gated stack. While Clerk loads the session we render nothing and keep the native splash up —
 * this is the standard expo-router pattern (`if (!ready) return null`) and means the sign-in screen
 * is never mounted during the loading window, so signed-in users go straight to the tabs with no
 * flash. Once loaded, exactly one branch is active and `Stack.Protected` swaps it declaratively on
 * sign-in/out.
 */
function GuardedStack() {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded) void SplashScreen.hideAsync();
  }, [isLoaded]);

  if (!isLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}

/** Public stack used when Clerk isn't configured — the template still runs straight to the tabs. */
function PublicStack() {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}

function ThemedNavigation() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {isAuthConfigured ? <GuardedStack /> : <PublicStack />}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Providers>
      <ThemedNavigation />
    </Providers>
  );
}
