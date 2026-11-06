import { useFocusEffect } from 'expo-router';
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

import { CompareBanner } from '@/components/compare-banner';
import { ErrorView } from '@/components/error-view';
import { PokemonGrid } from '@/components/pokemon-grid';
import { PokemonOptionsMenu } from '@/components/pokemon-options-menu';
import { SearchField } from '@/components/search-field';
import { useComparePick } from '@/hooks/use-compare-pick';
import type { PokemonListItem } from '@/hooks/use-pokemon-list';
import { usePokemonPress } from '@/hooks/use-pokemon-press';
import { usePokemonSearch } from '@/hooks/use-pokemon-search';
import { useTheme } from '@/hooks/use-theme';
import { normalizeSearchText } from '@/utils/search';

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
  const { first: compareFirst, cancel: cancelCompare } = useComparePick();
  const handlePress = usePokemonPress();

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

  // Android back leaves search mode first, then cancels picking a Pokémon to
  // compare; only while this tab is on screen. One handler, so the order is fixed.
  const picking = compareFirst !== null;
  useFocusEffect(
    useCallback(() => {
      if (!searching && !picking) {
        return undefined;
      }
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (searching) {
          exitSearch();
        } else {
          cancelCompare();
        }
        return true;
      });
      return () => subscription.remove();
    }, [searching, picking, exitSearch, cancelCompare]),
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
        onPress={handlePress}
        onOptionsPress={handleOptionsPress}
        dimmedId={compareFirst?.id}
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
      <CompareBanner />
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
