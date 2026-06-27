import { useSSO } from '@clerk/clerk-expo';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { ExternalLink } from '@/components/external-link';
import { GithubIcon } from '@/components/icons/github-icon';
import { GoogleIcon } from '@/components/icons/google-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { isAuthConfigured } from '@/lib/env';

// Required for the OAuth flow to dismiss the in-app browser when it redirects back.
WebBrowser.maybeCompleteAuthSession();

type OAuthStrategy = 'oauth_google' | 'oauth_github';

export default function SignInScreen() {
  if (!isAuthConfigured) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="subtitle">Auth not configured</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
          Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env and enable Google + GitHub in the Clerk
          dashboard to turn on sign-in.
        </ThemedText>
      </ThemedView>
    );
  }
  return <SignInForm />;
}

function SignInForm() {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();

  const [pending, setPending] = useState<OAuthStrategy | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSignIn = useCallback(
    async (strategy: OAuthStrategy) => {
      setPending(strategy);
      setError(null);
      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          redirectUrl: AuthSession.makeRedirectUri(),
        });
        // On success, the auth-gated stack swaps to the tabs once the session becomes active.
        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
        }
      } catch {
        setError('Sign-in failed or was cancelled. Please try again.');
      } finally {
        setPending(null);
      }
    },
    [startSSOFlow],
  );

  const busy = pending !== null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.main}>
          <View style={styles.hero}>
            <AnimatedIcon />
            <View style={styles.headings}>
              <ThemedText type="title" style={styles.title}>
                Welcome
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
                Sign in to continue to your account.
              </ThemedText>
            </View>
          </View>

          <View style={styles.actions}>
            <OAuthButton
              label="Continue with Google"
              icon={<GoogleIcon size={20} />}
              loading={pending === 'oauth_google'}
              disabled={busy}
              onPress={() => onSignIn('oauth_google')}
              backgroundColor="#ffffff"
              color="#1f1f1f"
              borderColor="#dadce0"
            />
            <OAuthButton
              label="Continue with GitHub"
              icon={<GithubIcon size={20} color="#ffffff" />}
              loading={pending === 'oauth_github'}
              disabled={busy}
              onPress={() => onSignIn('oauth_github')}
              backgroundColor="#24292f"
              color="#ffffff"
            />

            {error ? (
              <ThemedText type="small" style={styles.error}>
                {error}
              </ThemedText>
            ) : null}
          </View>
        </View>

        <ThemedText type="small" themeColor="textSecondary" style={styles.legal}>
          By continuing, you agree to our{' '}
          <ExternalLink href="https://example.com/terms" style={styles.legalLink}>
            Terms
          </ExternalLink>{' '}
          and{' '}
          <ExternalLink href="https://example.com/privacy" style={styles.legalLink}>
            Privacy Policy
          </ExternalLink>
          .
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

function OAuthButton({
  label,
  icon,
  loading,
  disabled,
  onPress,
  backgroundColor,
  color,
  borderColor,
}: {
  label: string;
  icon: React.ReactNode;
  loading: boolean;
  disabled: boolean;
  onPress: () => void;
  backgroundColor: string;
  color: string;
  borderColor?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => (pressed || disabled ? styles.pressed : undefined)}
    >
      <View
        style={[
          styles.button,
          { backgroundColor },
          borderColor ? { borderColor, borderWidth: StyleSheet.hairlineWidth } : null,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={color} />
        ) : (
          <>
            <View style={styles.buttonIcon}>{icon}</View>
            <Text style={[styles.buttonLabel, { color }]}>{label}</Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

/** Pre-warms the in-app browser on native so the OAuth sheet opens instantly. */
function useWarmUpBrowser() {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  centerText: { textAlign: 'center' },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.four,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.six,
  },
  hero: { alignItems: 'center', gap: Spacing.four },
  headings: { alignItems: 'center', gap: Spacing.one },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center' },
  actions: { gap: Spacing.two },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    height: 52,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  buttonIcon: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  buttonLabel: { fontSize: 16, fontWeight: '600' },
  pressed: { opacity: 0.85 },
  error: { color: '#e5484d', textAlign: 'center' },
  legal: { textAlign: 'center', paddingHorizontal: Spacing.two },
  legalLink: { textDecorationLine: 'underline' },
});
