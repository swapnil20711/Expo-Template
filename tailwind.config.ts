import type { Config } from 'tailwindcss';

import { spacing } from './src/constants/tokens';

// Named spacing tokens (e.g. `p-three`) sit alongside Tailwind's numeric defaults.
const namedSpacing = Object.fromEntries(
  Object.entries(spacing).map(([key, value]) => [key, `${value}px`]),
);

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-selected': 'rgb(var(--color-surface-selected) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
      },
      spacing: namedSpacing,
      fontFamily: {
        sans: 'var(--font-display)',
        mono: 'var(--font-mono)',
        rounded: 'var(--font-rounded)',
        serif: 'var(--font-serif)',
      },
    },
  },
  plugins: [],
} satisfies Config;
