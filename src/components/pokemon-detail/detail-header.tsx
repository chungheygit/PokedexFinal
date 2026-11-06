import { StyleSheet, Text, View } from 'react-native';

import { PokemonImage } from '@/components/pokemon-image';
import { TYPE_CHIP_HEIGHT, TypeChip } from '@/components/type-chip';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatNumber, getArtworkUrl } from '@/utils/pokemon';

const PADDING_TOP = Spacing.three + Spacing.one;
const NAME_LINE_HEIGHT = 34;
const ARTWORK_SIZE = 220;
/** How far the artwork reaches below the light blue into the white. */
const ARTWORK_OVERLAP = 64;
/** The light blue reaches this far above the header, so pulling down (iOS bounce) shows no white gap. */
const OVERSCROLL = 1000;

/** Scroll offsets between which the big name scrolls out of view. */
export const NAME_SCROLL_RANGE: [number, number] = [PADDING_TOP, PADDING_TOP + NAME_LINE_HEIGHT];

type DetailHeaderProps = {
  id: number;
  /** Already formatted; empty while there is nothing to show yet. */
  name: string;
  /** Type slugs; `undefined` while the Pokémon loads. */
  types: string[] | undefined;
};

/**
 * Name, number, type chips and the artwork overlapping the light blue top and
 * the white content. Every row has a fixed height, so nothing jumps when the
 * name or the types arrive.
 */
export function DetailHeader({ id, name, types }: DetailHeaderProps) {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.card }}>
      <View style={[styles.blue, { backgroundColor: theme.background }]} />
      <View style={styles.nameRow}>
        <Text
          style={[styles.name, { color: theme.text }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          accessibilityRole="header">
          {name}
        </Text>
        <Text style={[styles.number, { color: theme.textSecondary }]}>{formatNumber(id)}</Text>
      </View>
      <View style={styles.types}>
        {types?.map((type) => (
          <TypeChip key={type} type={type} />
        ))}
      </View>
      <PokemonImage
        uri={getArtworkUrl(id)}
        style={styles.artwork}
        placeholderSize={ARTWORK_SIZE / 2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blue: {
    position: 'absolute',
    top: -OVERSCROLL,
    left: 0,
    right: 0,
    bottom: ARTWORK_OVERLAP,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    height: NAME_LINE_HEIGHT,
    marginTop: PADDING_TOP,
    paddingHorizontal: Spacing.three,
  },
  name: {
    flex: 1,
    fontFamily: Fonts.bold,
    fontSize: 28,
    lineHeight: NAME_LINE_HEIGHT,
  },
  number: {
    fontFamily: Fonts.regular,
    fontSize: 24,
  },
  types: {
    flexDirection: 'row',
    gap: Spacing.two,
    height: TYPE_CHIP_HEIGHT,
    marginTop: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  artwork: {
    alignSelf: 'center',
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    marginTop: Spacing.three,
  },
});
