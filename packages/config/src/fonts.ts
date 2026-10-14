import { createFont } from 'tamagui'

const plusJakarta = {
  400: { normal: 'PlusJakartaSans_400Regular' },
  500: { normal: 'PlusJakartaSans_500Medium' },
  600: { normal: 'PlusJakartaSans_600SemiBold' },
  700: { normal: 'PlusJakartaSans_700Bold' },
  800: { normal: 'PlusJakartaSans_700Bold' },
  900: { normal: 'PlusJakartaSans_700Bold' },
  bold: { normal: 'PlusJakartaSans_700Bold' },
  normal: { normal: 'PlusJakartaSans_400Regular' },
} as const

const size = {
  1: 8, // B-5
  2: 10, // B-4
  3: 12, // B-3
  4: 14, // B-2
  5: 16, // B-1
  6: 22, // H-7
  7: 24, // H-6
  8: 28, // H-5
  9: 34, // H-4
  10: 40, // H-3
  11: 48, // H-2
  12: 58, // H-1
  true: 16,
} as const

const lineHeight = {
  1: 12,
  2: 15,
  3: 18,
  4: 21,
  5: 24,
  6: 33,
  7: 36,
  8: 42,
  9: 51,
  10: 60,
  11: 72,
  12: 87,
  true: 24,
} as const

export const headingFont = createFont({
  family: 'PlusJakartaSans_700Bold',
  size,
  lineHeight,
  weight: {
    4: '400',
    5: '500',
    6: '600',
    7: '700',
  },
  letterSpacing: {
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
  },
  face: plusJakarta,
})

export const bodyFont = createFont({
  family: 'PlusJakartaSans_400Regular',
  size,
  lineHeight,
  weight: {
    4: '400',
    5: '500',
    6: '600',
    7: '700',
  },
  letterSpacing: {
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
  },
  face: plusJakarta,
})
