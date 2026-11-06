import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CompareBanner } from '@/components/compare-banner';
import { ErrorView } from '@/components/error-view';
import { PokemonGrid } from '@/components/pokemon-grid';
import { PokemonOptionsMenu } from '@/components/pokemon-options-menu';
import { useComparePick } from '@/hooks/use-compare-pick';
import { useFavorites } from '@/hooks/use-favorites';
import { usePokemonPress } from '@/hooks/use-pokemon-press';
import { useTheme } from '@/hooks/use-theme';

type Pokemon = { id: number; name: string };

const EMPTY_TEXT = 'No favorites yet. Tap the heart on a Pokémon, or use ⋮ → Add to favorites.';

export default function FavoritesScreen() {
  const theme = useTheme();
  const { data, isError, refetch } = useFavorites();
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const { first: compareFirst, cancel: cancelCompare } = useComparePick();
  const handlePress = usePokemonPress();

  const handleOptionsPress = useCallback((pokemon: Pokemon) => {
    setSelected(pokemon);
    setMenuVisible(true);
  }, []);

  const closeMenu = useCallback(() => setMenuVisible(false), []);

  // Android back cancels picking a Pokémon to compare, only while this tab is on screen.
  const picking = compareFirst !== null;
  useFocusEffect(
    useCallback(() => {
      if (!picking) {
        return undefined;
      }
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        cancelCompare();
        return true;
      });
      return () => subscription.remove();
    }, [picking, cancelCompare]),
  );

  let content;
  if (isError) {
    // Retrying refetches, which opens the database again.
    content = <ErrorView message="Could not load your favorites." onRetry={() => refetch()} />;
  } else if (data) {
    content = (
      <PokemonGrid
        data={data}
        title="My favorites"
        emptyText={EMPTY_TEXT}
        onPress={handlePress}
        onOptionsPress={handleOptionsPress}
        dimmedId={compareFirst?.id}
      />
    );
  } else {
    content = (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <CompareBanner />
      {content}
      <PokemonOptionsMenu pokemon={selected} visible={menuVisible} onClose={closeMenu} />
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
});
