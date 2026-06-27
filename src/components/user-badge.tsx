import { useUser } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { GithubIcon } from '@/components/icons/github-icon';
import { GoogleIcon } from '@/components/icons/google-icon';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Compact identity chip for the signed-in user: avatar, display name, and the provider they used
 * to sign in. Render inside `<SignedIn>` so `useUser` always has an authenticated user.
 */
export function UserBadge() {
  const { user } = useUser();
  const theme = useTheme();

  if (!user) return null;

  const name = user.fullName ?? user.username ?? user.primaryEmailAddress?.emailAddress ?? 'You';
  const account = user.externalAccounts[0];
  const provider = account?.provider ?? '';
  const providerTitle = account?.providerTitle?.() ?? 'email';

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <Image source={{ uri: user.imageUrl }} style={styles.avatar} contentFit="cover" />
      <View style={styles.info}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {name}
        </ThemedText>
        <View style={styles.method}>
          {provider.includes('google') ? <GoogleIcon size={14} /> : null}
          {provider.includes('github') ? (
            <GithubIcon size={14} color={theme.textSecondary} />
          ) : null}
          <ThemedText type="small" themeColor="textSecondary">
            Signed in with {providerTitle}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00000010',
  },
  info: { gap: 2, flexShrink: 1 },
  method: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
});
