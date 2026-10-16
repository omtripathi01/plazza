// Design system tokens: colors, spacing, radius, font sizes, shadow. Every component imports from here.
import {scale} from './responsive';

// Light and dark palettes; useColors() returns the active one from the theme store.

export const lightColors = {
  primary: '#0F766E',
  primaryDark: '#115E59',
  primaryLight: '#CCFBF1',
  background: '#F6F7F9',
  card: '#FFFFFF',
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  danger: '#B91C1C',
  success: '#15803D',
  successLight: '#DCFCE7',
  warningLight: '#FEF3C7',
  warningText: '#92400E',
  rxBackground: '#FEE2E2',
  rxText: '#B91C1C',
  white: '#FFFFFF',
};

export const darkColors = {
  ...lightColors,
  primary: '#14B8A6',
  primaryDark: '#0F766E',
  primaryLight: '#134E4A',
  background: '#0B1220',
  card: '#1F2937',
  text: '#F9FAFB',
  muted: '#9CA3AF',
  border: '#374151',
  successLight: '#064E3B',
  success: '#6EE7B7',
  warningLight: '#78350F',
  warningText: '#FDE68A',
  rxBackground: '#7F1D1D',
  rxText: '#FECACA',
};

// Default (light) palette, used where a hook can't be called.
export const colors = lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = 12;

// Font family: system default (Roboto on Android) so weights render correctly everywhere.
// To use a custom font, add it under android/app/src/main/assets/fonts and set it here.
export const fontFamily = undefined;

// Content never stretches wider than this, so tablets and landscape keep readable line lengths.
export const maxContentWidth = 640;

// Font sizes scale with screen width (see responsive.js), so text stays readable on small and large phones.
export const fontSize = {
  hero: scale(32),
  title: scale(20),
  body: scale(16),
  small: scale(14),
  tiny: scale(12),
};

// Minimum touch target height for buttons (Android guideline is 48 dp).
export const minButtonHeight = 48;

// Soft card shadow used on every card.
export const shadow = {
  shadowColor: '#000000',
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: {width: 0, height: 2},
  elevation: 2,
};
