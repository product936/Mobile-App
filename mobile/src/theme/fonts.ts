import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  HankenGrotesk_800ExtraBold,
} from '@expo-google-fonts/hanken-grotesk';

/** Hanken Grotesk is the only typeface in the SI design system. */
export const fontAssets = {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  HankenGrotesk_800ExtraBold,
};

export type FontWeight = 400 | 500 | 600 | 700 | 800;

const families: Record<FontWeight, keyof typeof fontAssets> = {
  400: 'HankenGrotesk_400Regular',
  500: 'HankenGrotesk_500Medium',
  600: 'HankenGrotesk_600SemiBold',
  700: 'HankenGrotesk_700Bold',
  800: 'HankenGrotesk_800ExtraBold',
};

/**
 * Static font files carry their own weight, so we select the family instead
 * of setting `fontWeight` (which Android would synthesize on top).
 */
export function fontFamily(weight: FontWeight): string {
  return families[weight];
}
