import { type Ref, useCallback } from 'react';
import { FlatList, Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { getPokemonCardHeight, PokemonCard, type PokemonCardProps } from '@/components/pokemon-card';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const HEADER_HEIGHT = 64;
const EDGE = Spacing.four;
const GAP = Spacing.three;
/** Space above the first row when there is no title (`search.png`). */
const TOP_WITHOUT_TITLE = Spacing.four;

type GridItem = { id: number; name: string };

type PokemonGridProps = {
  data: readonly GridItem[];
  /** Shown in a 64 header above the cards; without it the cards start 24 from the top. */
  title?: string;
  onPress: PokemonCardProps['onPress'];
  onOptionsPress: PokemonCardProps['onOptionsPress'];
  /** Shown under the title when `data` is empty. */
  emptyText?: string;
  ref?: Ref<FlatList<GridItem>>;
};

function keyExtractor(item: GridItem) {
  return String(item.id);
}

/**
 * The 2-column card grid with an optional title on top: 24 from the screen
 * edges, 16 between cards, every card half a row (also a lone last card).
 * Dragging closes the keyboard; a tap on a card works with the keyboard open.
 */
export function PokemonGrid({ data, title, onPress, onOptionsPress, emptyText, ref }: PokemonGridProps) {
  const theme = useTheme();

  // Two cards and one gap between the screen edges (390 wide → 163 per card).
  const { width } = useWindowDimensions();
  const cardHeight = getPokemonCardHeight((width - 2 * EDGE - GAP) / 2);
  const rowHeight = cardHeight + GAP;
  const topHeight = title === undefined ? TOP_WITHOUT_TITLE : HEADER_HEIGHT;

  // With numColumns, FlatList asks for the layout of a row, not of a card.
  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: rowHeight,
      offset: topHeight + rowHeight * index,
      index,
    }),
    [rowHeight, topHeight],
  );

  const renderItem = useCallback(
    ({ item }: { item: GridItem }) => (
      <View style={[styles.cell, { height: cardHeight }]}>
        <PokemonCard id={item.id} name={item.name} onPress={onPress} onOptionsPress={onOptionsPress} />
      </View>
    ),
    [onPress, onOptionsPress, cardHeight],
  );

  return (
    <FlatList
      ref={ref}
      data={data}
      numColumns={2}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      ListHeaderComponent={
        title === undefined ? undefined : (
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">
              {title}
            </Text>
          </View>
        )
      }
      ListEmptyComponent={
        emptyText ? (
          <Text style={[styles.empty, { color: theme.textSecondary }]}>{emptyText}</Text>
        ) : undefined
      }
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.content, title === undefined && styles.contentWithoutTitle]}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={11}
      removeClippedSubviews={Platform.OS === 'android'}
    />
  );
}

const styles = StyleSheet.create({
  // Cells carry half the gap on each side, so the screen edge ends up at EDGE.
  content: {
    paddingHorizontal: EDGE - GAP / 2,
    paddingBottom: Spacing.three,
  },
  // getItemLayout counts this instead of the header.
  contentWithoutTitle: {
    paddingTop: TOP_WITHOUT_TITLE,
  },
  header: {
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: GAP / 2,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 24,
  },
  empty: {
    paddingHorizontal: GAP / 2,
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  row: {
    paddingBottom: GAP,
  },
  // Always half the row, also for the last card when the row has only one.
  cell: {
    width: '50%',
    paddingHorizontal: GAP / 2,
  },
});
