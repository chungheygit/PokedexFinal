import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EVOLUTION_SPRITE_WIDTH, EvolutionCard } from '@/components/pokemon-detail/evolution-card';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { EvolutionEntry } from '@/utils/evolution';

const CONNECTOR_HEIGHT = Spacing.five;
const DOT_SIZE = 3;
const DOT_COUNT = 4;

type EvolutionTabProps = {
  /** The chain by stage, the current Pokémon included. */
  entries: EvolutionEntry[];
  /** Species id of the Pokémon on screen: its card can't be tapped. */
  currentId: number;
  onSelect: (entry: EvolutionEntry) => void;
};

/** Every Pokémon in the chain as a card, joined by a dotted line. */
export function EvolutionTab({ entries, currentId, onSelect }: EvolutionTabProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {entries.map((entry, index) => (
        <Fragment key={entry.id}>
          {index > 0 && (
            // Drawn as dots: a dotted border on one side is unreliable in React Native.
            <View style={styles.connector}>
              {Array.from({ length: DOT_COUNT }, (_, dot) => (
                <View key={dot} style={[styles.dot, { backgroundColor: theme.textSecondary }]} />
              ))}
            </View>
          )}
          <EvolutionCard entry={entry} onPress={entry.id === currentId ? undefined : onSelect} />
        </Fragment>
      ))}
      {entries.length === 1 && (
        <Text style={[styles.note, { color: theme.textSecondary }]}>
          This Pokémon does not evolve.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  connector: {
    width: EVOLUTION_SPRITE_WIDTH,
    height: CONNECTOR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  note: {
    marginTop: Spacing.four,
    fontFamily: Fonts.regular,
    fontSize: 14,
    textAlign: 'center',
  },
});
