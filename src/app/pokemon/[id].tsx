import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { type ReactNode, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorView } from '@/components/error-view';
import { AboutTab } from '@/components/pokemon-detail/about-tab';
import { DetailHeader, NAME_SCROLL_RANGE } from '@/components/pokemon-detail/detail-header';
import {
  DETAIL_TAB_BAR_HEIGHT,
  type DetailTab,
  DetailTabBar,
} from '@/components/pokemon-detail/detail-tab-bar';
import { EvolutionTab } from '@/components/pokemon-detail/evolution-tab';
import { StatsTab } from '@/components/pokemon-detail/stats-tab';
import { Fonts, Spacing } from '@/constants/theme';
import { useEvolutionChain } from '@/hooks/use-evolution-chain';
import { usePokemon } from '@/hooks/use-pokemon';
import { usePokemonSpecies } from '@/hooks/use-pokemon-species';
import { useTheme } from '@/hooks/use-theme';
import { type EvolutionEntry, getEvolutionEntries } from '@/utils/evolution';
import { parsePokemonId } from '@/utils/pokemon';
import { getDisplayName } from '@/utils/pokemon-detail';

const BAR_HEIGHT = 56;
const BACK_SIZE = 40;

function goBack() {
  // Opened from a deep link there is no screen to go back to: go to the list.
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}

function openPokemon(entry: EvolutionEntry) {
  router.push({ pathname: '/pokemon/[id]', params: { id: String(entry.id), name: entry.name } });
}

export default function PokemonDetailScreen() {
  const params = useLocalSearchParams<{ id: string; name?: string }>();
  const id = parsePokemonId(params.id);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const pokemonQuery = usePokemon(id);
  const pokemon = pokemonQuery.data;
  const speciesQuery = usePokemonSpecies(pokemon?.speciesId);
  const species = speciesQuery.data;
  const chainQuery = useEvolutionChain(species?.chainId);
  const name = getDisplayName(params.name, pokemon, species?.officialName);

  const [tab, setTab] = useState<DetailTab>('about');
  const [viewportHeight, setViewportHeight] = useState(0);
  // The tab bar sits right under the header, so this is also where it starts to stick.
  const [headerHeight, setHeaderHeight] = useState(0);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const compactNameStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollOffset.get(), NAME_SCROLL_RANGE, [0, 1], Extrapolation.CLAMP),
  }));

  // Once the tab bar sticks, a new tab starts at its top instead of halfway down.
  function selectTab(next: DetailTab) {
    if (scrollOffset.get() > headerHeight) {
      scrollRef.current?.scrollTo({ y: headerHeight, animated: false });
    }
    setTab(next);
  }

  const bar = (
    <View
      style={[
        styles.bar,
        { paddingTop: insets.top, height: insets.top + BAR_HEIGHT, backgroundColor: theme.background },
      ]}>
      <Animated.Text
        style={[styles.compactName, { color: theme.text, top: insets.top }, compactNameStyle]}
        numberOfLines={1}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden>
        {name}
      </Animated.Text>
      <Pressable
        onPress={goBack}
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={Spacing.two}
        style={({ pressed }) => [styles.back, { opacity: pressed ? 0.5 : 1 }]}>
        <SymbolView
          name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
          size={24}
          tintColor={theme.text}
        />
      </Pressable>
    </View>
  );

  if (id === undefined) {
    return (
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        {bar}
        <ErrorView message="This Pokémon does not exist." />
      </View>
    );
  }

  let content: ReactNode;
  if (!pokemon) {
    content = pokemonQuery.isError ? (
      <ErrorView message="Could not load this Pokémon." onRetry={() => pokemonQuery.refetch()} />
    ) : (
      <Spinner color={theme.primary} />
    );
  } else if (tab === 'about') {
    content = <AboutTab pokemon={pokemon} name={name} />;
  } else if (tab === 'stats') {
    content = <StatsTab stats={pokemon.stats} />;
  } else {
    // Species and chain load on their own: only this tab waits for them or shows their error.
    const entries = getEvolutionEntries(chainQuery.data, species);
    const failedQuery = speciesQuery.isError ? speciesQuery : chainQuery.isError ? chainQuery : null;
    if (entries) {
      content = <EvolutionTab entries={entries} currentId={pokemon.id} onSelect={openPokemon} />;
    } else if (failedQuery) {
      content = (
        <ErrorView message="Could not load the evolutions." onRetry={() => failedQuery.refetch()} />
      );
    } else {
      content = <Spinner color={theme.primary} />;
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      {bar}
      <Animated.ScrollView
        ref={scrollRef}
        stickyHeaderIndices={[1]}
        onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.four }}>
        <View onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}>
          <DetailHeader id={id} name={name} types={pokemon?.types} />
        </View>
        <DetailTabBar selected={tab} onSelect={selectTab} />
        {/* At least the visible height under the tab bar, so a short tab never makes the scroll jump. */}
        <View
          style={[
            styles.content,
            { minHeight: Math.max(viewportHeight - DETAIL_TAB_BAR_HEIGHT - insets.bottom - Spacing.four, 0) },
          ]}>
          {content}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

function Spinner({ color }: { color: string }) {
  return (
    <View style={styles.spinner}>
      <ActivityIndicator size="large" color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
  },
  back: {
    width: BACK_SIZE,
    height: BACK_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Centred on the screen; the side padding keeps it clear of the back button.
  compactName: {
    position: 'absolute',
    left: Spacing.two + BACK_SIZE,
    right: Spacing.two + BACK_SIZE,
    height: BAR_HEIGHT,
    lineHeight: BAR_HEIGHT,
    textAlign: 'center',
    fontFamily: Fonts.semiBold,
    fontSize: 18,
  },
  content: {
    paddingTop: Spacing.three,
  },
  spinner: {
    paddingTop: Spacing.six,
    alignItems: 'center',
  },
});
