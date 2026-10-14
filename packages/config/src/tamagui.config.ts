import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'
import { bodyFont, headingFont } from './fonts'
import { animations } from './animations'
import {
  colorTokens,
  legacyColors,
  baseColors,
  green,
  neutral,
  red,
  orange,
  blue,
  alpha,
} from './tokens/colors'
import { space } from './tokens/space'
import { radius } from './tokens/radius'
import { stroke } from './tokens/stroke'

const lightTheme = {
  background: neutral[50],
  backgroundHover: neutral[100],
  backgroundPress: neutral[200],
  backgroundFocus: neutral[100],
  backgroundStrong: legacyColors.backgroundStrong,
  backgroundMuted: neutral[100],
  backgroundTransparent: alpha.neutral16,

  color: neutral[950],
  colorHover: neutral[900],
  colorPress: neutral[800],
  colorFocus: neutral[800],
  colorMuted: neutral[600],
  colorSubtle: neutral[700],
  colorTransparent: alpha.black24,

  borderColor: neutral[300],
  borderColorHover: neutral[400],
  borderColorFocus: blue[500],
  borderColorPress: neutral[400],

  placeholderColor: neutral[600],
  shadowColor: alpha.black16,
  outlineColor: blue[500],

  primary: blue[500],
  primaryBackground: alpha.blue16,

  success: green[500],
  successBackground: green[100],

  warning: orange[500],
  warningBackground: orange[100],

  error: red[500],
  errorBackground: red[100],

  info: blue[500],
  infoBackground: blue[100],

  accent: orange[500],
  accentBackground: alpha.orange16,
}

type AppTheme = {
  background: string
  backgroundHover: string
  backgroundPress: string
  backgroundFocus: string
  backgroundStrong: string
  backgroundMuted: string
  backgroundTransparent: string
  color: string
  colorHover: string
  colorPress: string
  colorFocus: string
  colorMuted: string
  colorSubtle: string
  colorTransparent: string
  borderColor: string
  borderColorHover: string
  borderColorFocus: string
  borderColorPress: string
  placeholderColor: string
  shadowColor: string
  outlineColor: string
  primary: string
  primaryBackground: string
  success: string
  successBackground: string
  warning: string
  warningBackground: string
  error: string
  errorBackground: string
  info: string
  infoBackground: string
  accent: string
  accentBackground: string
}

const darkTheme: AppTheme = {
  background: neutral[950],
  backgroundHover: neutral[900],
  backgroundPress: neutral[800],
  backgroundFocus: neutral[900],
  backgroundStrong: baseColors.black,
  backgroundMuted: neutral[900],
  backgroundTransparent: alpha.black24,

  color: neutral[50],
  colorHover: neutral[100],
  colorPress: neutral[200],
  colorFocus: neutral[200],
  colorMuted: neutral[400],
  colorSubtle: neutral[300],
  colorTransparent: alpha.neutral24,

  borderColor: neutral[800],
  borderColorHover: neutral[700],
  borderColorFocus: blue[500],
  borderColorPress: neutral[700],

  placeholderColor: neutral[500],
  shadowColor: alpha.black24,
  outlineColor: blue[500],

  primary: blue[500],
  primaryBackground: alpha.blue16,

  success: green[400],
  successBackground: alpha.green16,

  warning: orange[400],
  warningBackground: alpha.orange16,

  error: red[400],
  errorBackground: alpha.red16,

  info: blue[400],
  infoBackground: alpha.blue16,

  accent: orange[400],
  accentBackground: alpha.orange16,
}

// Avoid importing baseColors twice in theme block
// const baseColorsFallback = { black: '#000000' }

export const config = createTamagui({
  ...defaultConfig,
  animations,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
  tokens: {
    ...defaultConfig.tokens,
    space: {
      ...defaultConfig.tokens.space,
      ...space,
    },
    radius: {
      ...defaultConfig.tokens.radius,
      ...radius,
    },
    size: {
      ...defaultConfig.tokens.size,
      ...stroke,
    },
    color: {
      ...(defaultConfig.tokens as any).color,
      ...colorTokens,
      ...legacyColors,
      primaryBackground: alpha.blue16,
      successBackground: green[100],
      warningBackground: orange[100],
      errorBackground: red[100],
      infoBackground: blue[100],
    },
  },
  themes: {
    ...defaultConfig.themes,
    light: {
      ...defaultConfig.themes.light,
      ...lightTheme,
    },
    dark: {
      ...defaultConfig.themes.dark,
      ...darkTheme,
    },
  },
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false,
    allowedStyleValues: 'somewhat-strict-web',
  },
})
