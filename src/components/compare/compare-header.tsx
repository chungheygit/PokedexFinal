import { StyleSheet, Text, View } from 'react-native';

import { PokemonImage } from '@/components/pokemon-image';
import { TYPE_CHIP_HEIGHT, TypeChip } from '@/components/type-chip';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatName, formatNumber, getArtworkUrl } from '@/utils/pokemon';

const ARTWORK_SIZE = 120;
const VS_LINE_HEIGHT = 24;
/** The light blue reaches this far above the header, so pulling down (iOS bounce) shows no white gap. */
const OVERSCROLL = 1000;

export type CompareSide = {
  id: number;
  /** Already formatted; empty while there is nothing to show yet. */
  name: string;
  /** Type slugs; `undefined` while the Pokémon loads. */
  types: string[] | undefined;
};

type CompareHeaderProps = {
  left: CompareSide;
  right: CompareSide;
};

/** The light blue top of the compare screen: both Pokémon side by side, "vs" in between. */
export function CompareHeader({ left, right }: CompareHeaderProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.overscroll, { backgroundColor: theme.background }]} />
      <Column side={left} />
      {/* Centred on the artworks. */}
      <Text style={[styles.vs, { color: theme.textSecondary }]} accessible={false}>
        vs
      </Text>
      <Column side={right} />
    </View>
  );
}

function Column({ side }: { side: CompareSide }) {
  const theme = useTheme();
  const typesLabel = side.types?.map(formatName).join(', ');

  return (
    <View
      style={styles.column}
      accessible
      accessibilityLabel={[side.name, `number ${formatNumber(side.id)}`, typesLabel]
        .filter(Boolean)
        .join(', ')}>
      <PokemonImage
        uri={getArtworkUrl(side.id)}
        style={styles.artwork}
        placeholderSize={ARTWORK_SIZE / 2}
      />
      <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
        {side.name}
      </Text>
      <Text style={[styles.number, { color: theme.textSecondary }]}>{formatNumber(side.id)}</Text>
      <View style={styles.types}>
        {side.types?.map((type) => (
          <TypeChip key={type} type={type} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
  },
  overscroll: {
    position: 'absolute',
    top: -OVERSCROLL,
    left: 0,
    right: 0,
    height: OVERSCROLL,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
  },
  vs: {
    marginTop: Spacing.two + (ARTWORK_SIZE - VS_LINE_HEIGHT) / 2,
    fontFamily: Fonts.bold,
    fontSize: 18,
    lineHeight: VS_LINE_HEIGHT,
  },
  name: {
    marginTop: Spacing.two,
    fontFamily: Fonts.bold,
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  number: {
    marginTop: Spacing.one,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  // Room for one row of chips from the start; two chips that don't fit side by side wrap.
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
    minHeight: TYPE_CHIP_HEIGHT,
    marginTop: Spacing.three,
  },
});
