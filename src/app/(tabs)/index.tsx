import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView } from '@/components/error-view';
import { PokemonGrid } from '@/components/pokemon-grid';
import { PokemonOptionsMenu } from '@/components/pokemon-options-menu';
import { type PokemonListItem, usePokemonList } from '@/hooks/use-pokemon-list';
import { useTheme } from '@/hooks/use-theme';
import { getPokemonHref } from '@/utils/pokemon';

function openPokemon({ id, name }: PokemonListItem) {
  router.push(getPokemonHref(id, name));
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

  let content;
  if (data) {
    content = (
      <PokemonGrid
        data={data}
        title="All Pokémon"
        onPress={openPokemon}
        onOptionsPress={handleOptionsPress}
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
