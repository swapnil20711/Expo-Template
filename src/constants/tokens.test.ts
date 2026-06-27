import { describe, expect, it } from '@jest/globals';

import { palette, spacing } from './tokens';

describe('design tokens', () => {
  it('defines matching keys for light and dark palettes', () => {
    expect(Object.keys(palette.light).sort()).toEqual(Object.keys(palette.dark).sort());
  });

  it('exposes an ascending spacing scale', () => {
    const values = Object.values(spacing);
    const sorted = [...values].sort((a, b) => a - b);
    expect(values).toEqual(sorted);
  });
});
