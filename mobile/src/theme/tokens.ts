/**
 * SingleInterface design tokens for React Native.
 *
 * Ported from the SI design system (`colors_and_type.css`) and the mobile
 * overrides (`mobile_tokens.css`). Names mirror the CSS custom properties so a
 * value can be traced back to its source, e.g. `colors.primaryAccent` is
 * `--si-primary-accent` and `type.headline` is `--m-font-headline`.
 */
import { Easing } from 'react-native';

export const colors = {
  // Brand
  primaryDeep: '#0E0071',
  primaryAccent: '#0070FC',
  primaryHover: '#0A0054',
  primaryActive: '#060038',

  // AI gradient (start → end) and its light variant
  aiGradient: ['#0E0071', '#0070FC'] as const,
  aiGradientLight: ['#EEF2FF', '#DBEAFE'] as const,

  // Text
  textPrimary: '#111827',
  textSecondary: '#374151',
  textTertiary: '#6B7280',
  heading: '#122E44',
  body: '#53606A',

  // Surfaces
  surfaceBase: '#F9FAFD',
  surfaceAlt: '#F9FAFB',
  surfaceElevated: '#FFFFFF',

  // Borders
  borderDefault: '#E5E7EB',
  borderSubtle: '#F3F4F6',

  // Semantic
  success: '#16A34A',
  successBg: '#F0FDF4',
  successBorder: '#86EFAC',
  warning: '#CA8A04',
  warningBg: '#FEFCE8',
  warningBorder: '#FDE047',
  error: '#DC2626',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
  info: '#1D4ED8',
  infoBg: '#EFF6FF',
  infoBorder: '#BFDBFE',

  // Ratings
  starAmber: '#F59E0B',
  starAmberEmpty: '#E5E7EB',

  // Tailwind-family tints the prototype uses for icon tiles and chips
  blue50: '#EFF6FF',
  red100: '#FEE2E2',
  amberTile: '#FEF9E7',
  amber100: '#FEF3C7',
  amber700: '#B45309',
  amber600: '#D97706',
  indigo50: '#EEF2FF',
  violet100: '#F3E8FF',
  violet600: '#7C3AED',
  purple600: '#9333EA',
  unreadTint: '#F5F9FF',
  whatsapp: '#25D366',
  white: '#FFFFFF',
  scrim: 'rgba(15,23,42,0.45)',
  scrimStrong: 'rgba(15,23,42,0.5)',
} as const;

/** Mobile type scale (`--m-font-*`). */
export const type = {
  largeTitle: 32,
  title1: 28,
  title2: 22,
  title3: 18,
  headline: 16,
  body: 15,
  callout: 14,
  subhead: 13,
  footnote: 12,
  caption: 11,
} as const;

/** Line-height multipliers (`--m-leading-*`). */
export const leading = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.45,
} as const;

/** Spacing (`--m-gutter*`, `--m-stack*`, `--si-space-*`). */
export const space = {
  gutter: 16,
  gutterTight: 12,
  gutterLoose: 20,
  stackTight: 8,
  stack: 12,
  stackLoose: 16,
  stackSection: 24,
} as const;

/** Component heights (`--m-*-h`, `--m-touch-*`). */
export const sizes = {
  touchMin: 44,
  touchComfy: 48,
  inputH: 44,
  btnH: 48,
  btnSmH: 36,
  navbar: 44,
  fab: 56,
} as const;

/** Radii (`--si-radius-*`, `--m-radius-*`). */
export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  input: 10,
  card: 14,
  sheet: 20,
  full: 9999,
} as const;

/**
 * Shadows as CSS box-shadow strings. React Native's `boxShadow` style accepts
 * the same syntax on iOS, Android (new architecture) and web.
 */
export const shadows = {
  card: '0px 1px 2px rgba(15, 23, 42, 0.04), 0px 2px 8px rgba(0, 112, 252, 0.06)',
  primaryButton: '0px 6px 16px rgba(0, 112, 252, 0.28)',
  stickyButton: '0px 8px 20px rgba(0, 112, 252, 0.32)',
  amberButton: '0px 6px 16px rgba(217, 119, 6, 0.32)',
  dangerButton: '0px 6px 16px rgba(220, 38, 38, 0.28)',
  fab: '0px 8px 24px rgba(0, 112, 252, 0.35), 0px 2px 6px rgba(14, 0, 113, 0.15)',
  sheet: '0px -8px 28px rgba(15, 23, 42, 0.10)',
  aiMark: '0px 10px 24px rgba(0, 112, 252, 0.32)',
  sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  xl: '0px 20px 25px -5px rgba(0, 0, 0, 0.10), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
  thumb: '0px 1px 3px rgba(0, 0, 0, 0.25)',
  focusRing: '0px 0px 0px 4px rgba(0, 112, 252, 0.16)',
  errorRing: '0px 0px 0px 4px rgba(220, 38, 38, 0.10)',
} as const;

/** Motion (`--m-dur-*`, `--m-ease-*`). */
export const motion = {
  fast: 160,
  base: 240,
  slow: 320,
  sheet: 300,
  easeOut: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  easeInOut: Easing.bezier(0.4, 0, 0.2, 1),
  easeSheet: Easing.bezier(0.32, 0.72, 0, 1),
} as const;
