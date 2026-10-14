export const radius = {
  none: 0,
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
  14: 44,
  full: 999,

  // Legacy aliases
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
} as const

/** @deprecated use `radius` */
export const borderRadius = radius
