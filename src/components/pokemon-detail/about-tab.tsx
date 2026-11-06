import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  formatBaseExperience,
  formatHeight,
  formatName,
  formatNumber,
  formatWeight,
} from '@/utils/pokemon';
import type { PokemonDetail } from '@/utils/pokemon-detail';

const LABEL_WIDTH = 116;

type AboutTabProps = {
  pokemon: PokemonDetail;
  /** The same name as the header. */
  name: string;
};

export function AboutTab({ pokemon, name }: AboutTabProps) {
  const theme = useTheme();

  const rows: [label: string, value: string][] = [
    ['Name', name],
    ['ID', formatNumber(pokemon.id)],
    ['Base', formatBaseExperience(pokemon.baseExperience)],
    ['Weight', formatWeight(pokemon.weight)],
    ['Height', formatHeight(pokemon.height)],
    ['Types', pokemon.types.map(formatName).join(', ')],
    ['Abilities', pokemon.abilities.join(', ') || '—'],
  ];

  return (
    <View style={styles.container}>
      {rows.map(([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
          <Text style={[styles.value, { color: theme.textSecondary }]}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: Spacing.two,
  },
  label: {
    width: LABEL_WIDTH,
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
  },
  value: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 18,
  },
});
