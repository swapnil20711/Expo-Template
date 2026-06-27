/**
 * Design tokens — the single source of truth for colors and spacing.
 *
 * - React Native side (StyleSheet, themed-* components) consumes these via `constants/theme.ts`.
 * - NativeWind/Tailwind side consumes `spacing` in `tailwind.config.ts`, and the color values are
 *   mirrored as CSS custom properties in `src/global.css` (kept in sync with `palette` below).
 *
 * If you change a color here, update the matching `--color-*` variable in `src/global.css`.
 */

export const palette = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export const spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;
