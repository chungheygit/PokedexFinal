import { useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BACK_BUTTON_SIZE, BackButton } from '@/components/back-button';
import { CompareHeader } from '@/components/compare/compare-header';
import { CompareStats } from '@/components/compare/compare-stats';
import { ErrorView } from '@/components/error-view';
import { Fonts, Spacing } from '@/constants/theme';
import { usePokemon } from '@/hooks/use-pokemon';
import { usePokemonSpecies } from '@/hooks/use-pokemon-species';
import { useTheme } from '@/hooks/use-theme';
import { getCompareRows } from '@/utils/compare';
import { parsePokemonId } from '@/utils/pokemon';
import { getDisplayName } from '@/utils/pokemon-detail';

const BAR_HEIGHT = 56;

type CompareParams = {
  first: string;
  firstName?: string;
  second: string;
  secondName?: string;
};

export default function CompareScreen() {
  const params = useLocalSearchParams<CompareParams>();
  const firstId = parsePokemonId(params.first);
  const secondId = parsePokemonId(params.second);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // The same queries and cache as the detail screen.
  const firstQuery = usePokemon(firstId);
  const secondQuery = usePokemon(secondId);
  const first = firstQuery.data;
  const second = secondQuery.data;
  const firstSpecies = usePokemonSpecies(first?.speciesId).data;
  const secondSpecies = usePokemonSpecies(second?.speciesId).data;
  const firstName = getDisplayName(params.firstName, first, firstSpecies?.officialName);
  const secondName = getDisplayName(params.secondName, second, secondSpecies?.officialName);

  const bar = (
    <View
      style={[
        styles.bar,
        { paddingTop: insets.top, height: insets.top + BAR_HEIGHT, backgroundColor: theme.background },
      ]}>
      <BackButton />
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={1} accessibilityRole="header">
        Compare
      </Text>
      {/* Same width as ←, so the title stays centred. */}
      <View style={styles.spacer} />
    </View>
  );

  if (firstId === undefined || secondId === undefined) {
    return (
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        {bar}
        <ErrorView message="This Pokémon does not exist." />
      </View>
    );
  }

  let stats: ReactNode;
  if (first && second) {
    stats = (
      <CompareStats
        rows={getCompareRows(first.stats, second.stats)}
        leftName={firstName}
        rightName={secondName}
      />
    );
  } else if (firstQuery.isError || secondQuery.isError) {
    stats = (
      <ErrorView
        message="Could not load the comparison."
        onRetry={() => {
          // Only the one(s) that failed; a loaded Pokémon stays as it is.
          if (firstQuery.isError) {
            firstQuery.refetch();
          }
          if (secondQuery.isError) {
            secondQuery.refetch();
          }
        }}
      />
    );
  } else {
    stats = (
      <View style={styles.spinner}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      {bar}
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.four }}>
        <CompareHeader
          left={{ id: firstId, name: firstName, types: first?.types }}
          right={{ id: secondId, name: secondName, types: second?.types }}
        />
        {stats}
      </ScrollView>
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
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Fonts.semiBold,
    fontSize: 18,
  },
  spacer: {
    width: BACK_BUTTON_SIZE,
  },
  spinner: {
    paddingTop: Spacing.six,
    alignItems: 'center',
  },
});
