type ColorRamp = {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

const ramp = (values: ColorRamp) => values

export const baseColors = {
  black: '#000000',
  white: '#FFFFFF',
  modalDark: '#101010',
} as const

export const green = ramp({
  50: '#EAF7EE',
  100: '#D9F5E6',
  200: '#C2F5DA',
  300: '#84D984',
  400: '#3EE089',
  500: '#1FC16B',
  600: '#1DAF61',
  700: '#178D4E',
  800: '#1A7546',
  900: '#0D5433',
  950: '#0B4627',
})

export const blue = ramp({
  50: '#F0F4FF',
  100: '#E6EDFF',
  200: '#C2D4FF',
  300: '#94B0FF',
  400: '#628DFF',
  500: '#335CFF',
  600: '#2A4AD4',
  700: '#223BA8',
  800: '#1B2F85',
  900: '#142366',
  950: '#0E1A4D',
})

export const sky = ramp({
  50: '#F5FBFF',
  100: '#E6F7FF',
  200: '#D3EEFF',
  300: '#97DFFF',
  400: '#62CEFF',
  500: '#3BC2FF',
  600: '#2EAFE9',
  700: '#2697D0',
  800: '#1F7DA0',
  900: '#18656B',
  950: '#124B58',
})

export const neutral = ramp({
  50: '#F8F8F7',
  100: '#FAFAFA',
  200: '#F5F5F5',
  300: '#E5E5E5',
  400: '#D4D4D4',
  500: '#A3A3A3',
  600: '#737373',
  700: '#525252',
  800: '#404040',
  900: '#262626',
  950: '#171717',
})

export const red = ramp({
  50: '#FFF5F6',
  100: '#FFE6E9',
  200: '#FFD3D8',
  300: '#FF97A0',
  400: '#FF6275',
  500: '#F93B41',
  600: '#CE2E34',
  700: '#AD262D',
  800: '#8D1F2B',
  900: '#6B1822',
  950: '#581213',
})

export const yellow = ramp({
  50: '#FFFFF5',
  100: '#FFFEE6',
  200: '#FFFBD3',
  300: '#FFF397',
  400: '#FFED62',
  500: '#F9D93B',
  600: '#CEB32E',
  700: '#AD9826',
  800: '#8D7C1F',
  900: '#6B5E18',
  950: '#584E12',
})

export const pink = ramp({
  50: '#FFF5FA',
  100: '#FFE6F4',
  200: '#FFD3EA',
  300: '#FF97D3',
  400: '#FF62B2',
  500: '#F93B9D',
  600: '#CE2E84',
  700: '#AD266C',
  800: '#8D1F57',
  900: '#6B1842',
  950: '#58123B',
})

export const orange = ramp({
  50: '#FFF5EB',
  100: '#FFEDDD',
  200: '#FFDDC0',
  300: '#FFC187',
  400: '#FFAA49',
  500: '#FF9319',
  600: '#F38014',
  700: '#DB6E12',
  800: '#B75B10',
  900: '#8E440D',
  950: '#72330A',
})

export const purple = ramp({
  50: '#F5F5FF',
  100: '#E9E8FF',
  200: '#D4D0FF',
  300: '#BBAFFF',
  400: '#9C87F8',
  500: '#7E62F4',
  600: '#6D53D3',
  700: '#5B42C3',
  800: '#4D35AF',
  900: '#3D259B',
  950: '#2E1A7E',
})

export const teal = ramp({
  50: '#EAF7F6',
  100: '#D9F5F1',
  200: '#C2F5EE',
  300: '#84D9D2',
  400: '#3EE0D2',
  500: '#1FC1B0',
  600: '#1DAF9C',
  700: '#178D7D',
  800: '#1A7569',
  900: '#0D564A',
  950: '#09463B',
})

export const alphaBase = {
  neutral: '#262626',
  blue: '#335CFF',
  orange: '#FA7219',
  red: '#FB374B',
  green: '#1FC16B',
  yellow: '#FBC54B',
  sky: '#47C2FF',
  purple: '#7B4CFF',
  pink: '#FB4BA3',
  teal: '#22CBB8',
  black: '#171717',
} as const

export type AlphaLevel = 10 | 16 | 24

export const withAlpha = (hex: string, level: AlphaLevel): string => {
  const opacity = level === 10 ? 0.1 : level === 16 ? 0.16 : 0.24
  const normalized = hex.replace('#', '')
  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export const alpha = {
  neutral10: withAlpha(alphaBase.neutral, 10),
  neutral16: withAlpha(alphaBase.neutral, 16),
  neutral24: withAlpha(alphaBase.neutral, 24),
  blue10: withAlpha(alphaBase.blue, 10),
  blue16: withAlpha(alphaBase.blue, 16),
  blue24: withAlpha(alphaBase.blue, 24),
  orange10: withAlpha(alphaBase.orange, 10),
  orange16: withAlpha(alphaBase.orange, 16),
  orange24: withAlpha(alphaBase.orange, 24),
  red10: withAlpha(alphaBase.red, 10),
  red16: withAlpha(alphaBase.red, 16),
  red24: withAlpha(alphaBase.red, 24),
  green10: withAlpha(alphaBase.green, 10),
  green16: withAlpha(alphaBase.green, 16),
  green24: withAlpha(alphaBase.green, 24),
  yellow10: withAlpha(alphaBase.yellow, 10),
  yellow16: withAlpha(alphaBase.yellow, 16),
  yellow24: withAlpha(alphaBase.yellow, 24),
  sky10: withAlpha(alphaBase.sky, 10),
  sky16: withAlpha(alphaBase.sky, 16),
  sky24: withAlpha(alphaBase.sky, 24),
  purple10: withAlpha(alphaBase.purple, 10),
  purple16: withAlpha(alphaBase.purple, 16),
  purple24: withAlpha(alphaBase.purple, 24),
  pink10: withAlpha(alphaBase.pink, 10),
  pink16: withAlpha(alphaBase.pink, 16),
  pink24: withAlpha(alphaBase.pink, 24),
  teal10: withAlpha(alphaBase.teal, 10),
  teal16: withAlpha(alphaBase.teal, 16),
  teal24: withAlpha(alphaBase.teal, 24),
  black10: withAlpha(alphaBase.black, 10),
  black16: withAlpha(alphaBase.black, 16),
  black24: withAlpha(alphaBase.black, 24),
} as const

const flattenRamp = (name: string, values: ColorRamp) =>
  Object.fromEntries(Object.entries(values).map(([step, hex]) => [`${name}${step}`, hex]))

/** Flat map for Tamagui `tokens.color` */
export const colorTokens = {
  ...baseColors,
  ...flattenRamp('green', green),
  ...flattenRamp('blue', blue),
  ...flattenRamp('sky', sky),
  ...flattenRamp('neutral', neutral),
  ...flattenRamp('red', red),
  ...flattenRamp('yellow', yellow),
  ...flattenRamp('pink', pink),
  ...flattenRamp('orange', orange),
  ...flattenRamp('purple', purple),
  ...flattenRamp('teal', teal),
  ...alpha,
} as const

/**
 * Legacy flat export — keeps existing `import { colors } from '@my/config'` working.
 */
export const legacyColors = {
  primary: '#335CFF',
  background: neutral[50],
  backgroundStrong: baseColors.white,
  backgroundMuted: neutral[100],
  backgroundSubtle: neutral[200],
  text: neutral[950],
  textSubtle: neutral[700],
  textMuted: neutral[600],
  textFaint: neutral[400],
  success: green[500],
  warning: orange[500],
  error: red[500],
  info: blue[500],
  accent: orange[500],
  border: neutral[300],
  borderSubtle: neutral[400],
  white: baseColors.white,
  black: baseColors.black,
  placeholderColor: neutral[600],
} as const
