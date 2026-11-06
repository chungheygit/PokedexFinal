/**
 * The design system: colours, fonts, spacing and radius, measured from the Figma
 * screenshots in `specs/design/`. Components read colours through `useTheme()`
 * and never contain a hex code.
 */

import '@/global.css';

import { Platform } from 'react-native';

const palette = {
  background: '#ECF6FF',
  cardTop: '#F6F6FF',
  card: '#FFFFFF',
  primary: '#5126F5',
  onPrimary: '#FFFFFF',
  text: '#111532',
  textSecondary: '#84838B',
  backdrop: 'rgba(17, 21, 50, 0.4)',
  /** Type chip on the light blue detail header. */
  chip: '#DDE3EF',
  /** Line under the detail tab bar. */
  divider: '#E4E4E4',
  /** Empty part of a stat bar. */
  track: '#F2F2F2',
  /** The filled heart of a favorite (measured from `detail-stats.png`). */
  favorite: '#FF395C',
} as const;

/**
 * One colour per Pokémon type. Grass, poison, fire and electric are from the
 * Figma; the others are the usual type hues at the same strength.
 */
export const TypeColors: Readonly<Record<string, string>> = {
  normal: '#9DA0AA',
  fire: '#FF5475',
  water: '#4A90DA',
  grass: '#62B957',
  electric: '#FFCF00',
  ice: '#61CEC0',
  fighting: '#D04164',
  poison: '#A074BF',
  ground: '#DD7748',
  flying: '#748FC9',
  psychic: '#EA5D60',
  bug: '#8CB230',
  rock: '#BAAB82',
  ghost: '#556AAE',
  dragon: '#0F6AC0',
  dark: '#58575F',
  steel: '#417D9A',
  fairy: '#ED6EC7',
};

/** The colour of a type slug, or `fallback` for a type we don't know (e.g. a future one). */
export function getTypeColor(type: string, fallback: string): string {
  return Object.hasOwn(TypeColors, type) ? TypeColors[type] : fallback;
}

export const Colors = {
  light: {
    ...palette,
    // Still used by the template leftovers (collapsible, hint-row).
    backgroundElement: palette.cardTop,
    backgroundSelected: palette.cardTop,
  },
  // Dark mode is not designed yet: same values as light for now.
  dark: {
    ...palette,
    backgroundElement: palette.cardTop,
    backgroundSelected: palette.cardTop,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** Rubik, loaded from `assets/fonts/` in `src/app/_layout.tsx`. */
export const Fonts = {
  regular: 'Rubik-Regular',
  medium: 'Rubik-Medium',
  semiBold: 'Rubik-SemiBold',
  bold: 'Rubik-Bold',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = { s: 8, m: 12, l: 16 } as const;

export const Brand = { link: '#3c87f7', splash: '#208AEF' } as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
