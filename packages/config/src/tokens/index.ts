export * from './colors'
export * from './space'
export * from './radius'
export * from './stroke'
export * from './shadows'

import { legacyColors } from './colors'
import { space } from './space'
import { radius } from './radius'

/** Backward-compatible named exports used across the app today */
export const colors = legacyColors
export const spacing = space
export const borderRadius = radius

export const typography = {
  h1: { fontSize: 58, lineHeight: 87, fontWeight: '700' as const },
  h2: { fontSize: 48, lineHeight: 72, fontWeight: '700' as const },
  h3: { fontSize: 40, lineHeight: 60, fontWeight: '700' as const },
  h4: { fontSize: 34, lineHeight: 51, fontWeight: '700' as const },
  h5: { fontSize: 28, lineHeight: 42, fontWeight: '700' as const },
  h6: { fontSize: 24, lineHeight: 36, fontWeight: '700' as const },
  h7: { fontSize: 22, lineHeight: 33, fontWeight: '500' as const },
  b1: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  b2: { fontSize: 14, lineHeight: 21, fontWeight: '400' as const },
  b3: { fontSize: 12, lineHeight: 18, fontWeight: '400' as const },
  b4: { fontSize: 10, lineHeight: 15, fontWeight: '400' as const },
  b5: { fontSize: 8, lineHeight: 12, fontWeight: '400' as const },
}
