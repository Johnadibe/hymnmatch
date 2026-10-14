/** Design-system spacing scale (#0 → #16) */
export const space = {
  0: 1,
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 10,
  6: 12,
  7: 16,
  8: 20,
  9: 24,
  10: 28,
  11: 32,
  12: 36,
  13: 40,
  14: 48,
  15: 56,
  16: 64,

  // Legacy aliases (keep old screens working)
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const

/** @deprecated use `space` */
export const spacing = space
