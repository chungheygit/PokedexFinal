import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  type FlatList,
  Keyboard,
  StyleSheet,
  type TextInputInstance,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView } from '@/components/error-view';
import { PokemonGrid } from '@/components/pokemon-grid';
import { PokemonOptionsMenu } from '@/components/pokemon-options-menu';
import { SearchField } from '@/components/search-field';
import type { PokemonListItem } from '@/hooks/use-pokemon-list';
import { usePokemonSearch } from '@/hooks/use-pokemon-search';
import { useTheme } from '@/hooks/use-theme';
import { getPokemonHref } from '@/utils/pokemon';
import { normalizeSearchText } from '@/utils/search';

function openPokemon({ id, name }: PokemonListItem) {
  Keyboard.dismiss();
  router.push(getPokemonHref(id, name));
}

export default function HomeScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  // Starts on focus and ends only through exitSearch, so the title never pops back mid-scroll.
  const [searching, setSearching] = useState(false);
  const { results, isError, refetch } = usePokemonSearch(query);
  const [selected, setSelected] = useState<PokemonListItem | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const inputRef = useRef<TextInputInstance>(null);
  const listRef = useRef<FlatList<PokemonListItem>>(null);

  const handleOptionsPress = useCallback((pokemon: PokemonListItem) => {
    Keyboard.dismiss();
    setSelected(pokemon);
    setMenuVisible(true);
  }, []);

  const closeMenu = useCallback(() => setMenuVisible(false), []);
  const startSearch = useCallback(() => setSearching(true), []);
  // Typing also starts search mode, so a query never shows next to the title.
  const changeQuery = useCallback((text: string) => {
    setQuery(text);
    setSearching(true);
  }, []);

  const exitSearch = useCallback(() => {
    inputRef.current?.blur();
    Keyboard.dismiss();
    setQuery('');
    setSearching(false);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []);

  // New results start at the first match. A query that only adds a space or a
  // dot gives the same results and does not jump.
  const normalizedQuery = normalizeSearchText(query);
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [normalizedQuery]);

  // Android back leaves search mode first, only while this tab is on screen.
  useFocusEffect(
    useCallback(() => {
      if (!searching) {
        return undefined;
      }
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        exitSearch();
        return true;
      });
      return () => subscription.remove();
    }, [searching, exitSearch]),
  );

  // Switching to another tab closes the keyboard; the search itself stays.
  useFocusEffect(useCallback(() => () => inputRef.current?.blur(), []));

  let content;
  if (results) {
    content = (
      <PokemonGrid
        ref={listRef}
        data={results}
        title={searching ? undefined : 'All Pokémon'}
        emptyText={`No Pokémon found for "${query.trim()}".`}
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
      <SearchField
        ref={inputRef}
        value={query}
        onChangeText={changeQuery}
        searching={searching}
        onFocus={startSearch}
        onBack={exitSearch}
        editable={results !== undefined}
      />
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
