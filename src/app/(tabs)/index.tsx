import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView } from '@/components/error-view';
import { OptionsMenu, type OptionsMenuItem } from '@/components/options-menu';
import { getPokemonCardHeight, PokemonCard } from '@/components/pokemon-card';
import { Fonts, Spacing } from '@/constants/theme';
import { type PokemonListItem, usePokemonList } from '@/hooks/use-pokemon-list';
import { useTheme } from '@/hooks/use-theme';
import { getShareText } from '@/utils/pokemon';

const HEADER_HEIGHT = 64;
const EDGE = Spacing.four;
const GAP = Spacing.three;

function keyExtractor(item: PokemonListItem) {
  return String(item.id);
}

function openPokemon(pokemon: PokemonListItem) {
  router.push({ pathname: '/pokemon/[id]', params: { id: String(pokemon.id), name: pokemon.name } });
}

function sharePokemon(id: number, name: string) {
  Share.share({ message: getShareText(id, name) }).catch(() => {
    // The user closed the share sheet or sharing is unavailable: nothing to do.
  });
}

export default function HomeScreen() {
  const theme = useTheme();
  const { data, isError, refetch } = usePokemonList();
  const [selected, setSelected] = useState<PokemonListItem | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleOptionsPress = useCallback((pokemon: PokemonListItem) => {
    setSelected(pokemon);
    setMenuVisible(true);
  }, []);

  const closeMenu = useCallback(() => setMenuVisible(false), []);

  // Two cards and one gap between the screen edges (390 wide → 163 per card).
  const { width } = useWindowDimensions();
  const cardHeight = getPokemonCardHeight((width - 2 * EDGE - GAP) / 2);
  const rowHeight = cardHeight + GAP;

  // With numColumns, FlatList asks for the layout of a row, not of a card.
  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: rowHeight,
      offset: HEADER_HEIGHT + rowHeight * index,
      index,
    }),
    [rowHeight],
  );

  const renderItem = useCallback(
    ({ item }: { item: PokemonListItem }) => (
      <View style={[styles.cell, { height: cardHeight }]}>
        <PokemonCard
          id={item.id}
          name={item.name}
          onPress={openPokemon}
          onOptionsPress={handleOptionsPress}
        />
      </View>
    ),
    [handleOptionsPress, cardHeight],
  );

  const menuItems: OptionsMenuItem[] = selected
    ? [
        {
          key: 'open',
          label: 'Open Pokémon',
          icon: { ios: 'arrow.up.left.and.arrow.down.right', android: 'open_in_full' },
          onPress: () => openPokemon(selected),
        },
        {
          key: 'share',
          label: 'Share',
          icon: { ios: 'square.and.arrow.up', android: 'share' },
          onPress: () => sharePokemon(selected.id, selected.name),
        },
      ]
    : [];

  let content;
  if (data) {
    content = (
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">
              All Pokémon
            </Text>
          </View>
        }
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={11}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    );
  } else if (isError) {
    content = <ErrorView message="Could not load the Pokémon." onRetry={() => refetch()} />;
  } else {
    content = (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {content}
      <OptionsMenu visible={menuVisible} items={menuItems} onClose={closeMenu} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Cells carry half the gap on each side, so the screen edge ends up at EDGE.
  content: {
    paddingHorizontal: EDGE - GAP / 2,
    paddingBottom: Spacing.three,
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
  row: {
    paddingBottom: GAP,
  },
  // Always half the row, also for the last card when the row has only one.
  cell: {
    width: '50%',
    paddingHorizontal: GAP / 2,
  },
});
