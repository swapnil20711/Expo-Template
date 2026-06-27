import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

/**
 * Demonstrates the Clerk auth loop: `SignedOut` shows a CTA to the sign-in screen, `SignedIn`
 * shows the user's profile and a sign-out button. Swap this for your real account UI.
 */
export function Account() {
  return (
    <View style={styles.wrapper}>
      <SignedOut>
        <ThemedText type="small" themeColor="textSecondary">
          Sign in with Google or GitHub to see your profile here.
        </ThemedText>
        <Link href="/sign-in" asChild>
          <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <ThemedText type="smallBold" style={styles.buttonLabel}>
              Sign in
            </ThemedText>
          </Pressable>
        </Link>
      </SignedOut>
      <SignedIn>
        <SignedInDetails />
      </SignedIn>
    </View>
  );
}

function SignedInDetails() {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <View style={styles.details}>
      <ThemedText type="smallBold">{user?.fullName ?? user?.username ?? 'Signed in'}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {user?.primaryEmailAddress?.emailAddress}
      </ThemedText>
      <Pressable onPress={() => signOut()}>
        <ThemedText type="link" themeColor="textSecondary">
          Sign out
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: Spacing.two },
  details: { gap: Spacing.one },
  button: {
    backgroundColor: '#3c87f7',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    alignSelf: 'flex-start',
  },
  buttonLabel: { color: '#ffffff' },
  pressed: { opacity: 0.8 },
});
