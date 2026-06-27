import type { ErrorBoundaryProps } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

/**
 * App-wide error fallback. Re-exported as `ErrorBoundary` from the root `_layout` so expo-router
 * renders it whenever a route throws during render, with a retry that re-mounts the segment.
 */
export function AppErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Something went wrong</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.message}>
        {error.message}
      </ThemedText>
      <Pressable
        onPress={() => retry()}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <ThemedText type="smallBold" style={styles.buttonLabel}>
          Try again
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  message: { textAlign: 'center' },
  button: {
    backgroundColor: '#3c87f7',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  buttonLabel: { color: '#ffffff' },
  pressed: { opacity: 0.85 },
});
