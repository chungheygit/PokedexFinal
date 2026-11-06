import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getStatFraction } from '@/utils/pokemon';
import type { StatRow } from '@/utils/pokemon-detail';

const BAR_HEIGHT = 4;

type StatsTabProps = {
  stats: StatRow[];
};

/** Label and value per stat, with a purple bar of value ÷ 150. */
export function StatsTab({ stats }: StatsTabProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <View
          key={stat.key}
          style={styles.row}
          accessible
          accessibilityLabel={`${stat.label}, ${stat.value}`}>
          <View style={styles.labels}>
            <Text style={[styles.label, { color: theme.text }]}>{stat.label}</Text>
            <Text style={[styles.value, { color: theme.textSecondary }]}>{stat.value}</Text>
          </View>
          <View style={[styles.track, { backgroundColor: theme.track }]}>
            <View
              style={[
                styles.bar,
                {
                  backgroundColor: theme.primary,
                  width: `${getStatFraction(stat.value) * 100}%`,
                },
              ]}
            />
          </View>
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
    gap: Spacing.three - Spacing.one,
    paddingVertical: Spacing.two,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
  },
  value: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 18,
  },
  track: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden',
  },
  bar: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
  },
});
