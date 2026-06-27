import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

/**
 * Resolved color scheme ('light' | 'dark'), unified through NativeWind so that both the
 * StyleSheet-based themed components and `className` utilities always agree — including when the
 * user overrides the system theme via the settings store ([[settings-store]]).
 */
export function useColorScheme(): 'light' | 'dark' {
  const { colorScheme } = useNativeWindColorScheme();
  return colorScheme ?? 'light';
}
