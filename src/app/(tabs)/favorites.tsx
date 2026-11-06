import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView } from '@/components/error-view';
import { PokemonGrid } from '@/components/pokemon-grid';
import { PokemonOptionsMenu } from '@/components/pokemon-options-menu';
import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';
import { getPokemonHref } from '@/utils/pokemon';

type Pokemon = { id: number; name: string };

const EMPTY_TEXT = 'No favorites yet. Tap the heart on a Pokémon, or use ⋮ → Add to favorites.';

function openPokemon({ id, name }: Pokemon) {
  router.push(getPokemonHref(id, name));
}

export default function FavoritesScreen() {
  const theme = useTheme();
  const { data, isError, refetch } = useFavorites();
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleOptionsPress = useCallback((pokemon: Pokemon) => {
    setSelected(pokemon);
    setMenuVisible(true);
  }, []);

  const closeMenu = useCallback(() => setMenuVisible(false), []);

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
        onPress={openPokemon}
        onOptionsPress={handleOptionsPress}
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
