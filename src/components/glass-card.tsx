import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type GlassCardProps = ViewProps & {
  /** Glass tint. Falls back to a solid surface color where liquid glass is unavailable. */
  tintColor?: string;
};

/**
 * A card backed by iOS 26 Liquid Glass (`expo-glass-effect`) when available, with a graceful
 * themed-surface fallback on Android, web, and older iOS. Drop it anywhere you'd use a card.
 */
export function GlassCard({ style, tintColor, children, ...rest }: GlassCardProps) {
  const theme = useTheme();

  if (isLiquidGlassAvailable()) {
    return (
      <GlassView
        style={[styles.card, style]}
        glassEffectStyle="regular"
        tintColor={tintColor}
        {...rest}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    overflow: 'hidden',
  },
});
