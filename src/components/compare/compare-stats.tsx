import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { CompareRow, StatResult } from '@/utils/compare';
import { getStatFraction } from '@/utils/pokemon';

const BAR_HEIGHT = 8;
/** Fixed slot for a value at the outer edge, wide enough for 3 digits. */
const VALUE_WIDTH = 36;

type CompareStatsProps = {
  rows: CompareRow[];
  leftName: string;
  rightName: string;
};

/**
 * One row per stat: the name centred, under it two bars growing outwards from
 * the middle, the values fixed at the outer edges. The higher value (or both
 * on a tie) is purple and bold.
 */
export function CompareStats({ rows, leftName, rightName }: CompareStatsProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {rows.map((row) => (
        <View
          key={row.key}
          style={styles.row}
          accessible
          accessibilityLabel={`${row.label}: ${leftName} ${row.left}, ${rightName} ${row.right}`}>
          <Text style={[styles.label, { color: theme.text }]}>{row.label}</Text>
          <View style={styles.bars}>
            <Value value={row.left} result={row.leftResult} align="left" />
            <Bar value={row.left} result={row.leftResult} side="left" />
            <Bar value={row.right} result={row.rightResult} side="right" />
            <Value value={row.right} result={row.rightResult} align="right" />
          </View>
        </View>
      ))}
    </View>
  );
}

function Value({ value, result, align }: { value: number; result: StatResult; align: 'left' | 'right' }) {
  const theme = useTheme();
  const highlighted = result !== 'lower';

  return (
    <Text
      style={[
        styles.value,
        {
          color: highlighted ? theme.primary : theme.textSecondary,
          fontFamily: highlighted ? Fonts.bold : Fonts.regular,
          textAlign: align,
        },
      ]}>
      {value}
    </Text>
  );
}

/** A track with the bar against the middle: the left one grows to the left, the right one to the right. */
function Bar({ value, result, side }: { value: number; result: StatResult; side: 'left' | 'right' }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: theme.track, alignItems: side === 'left' ? 'flex-end' : 'flex-start' },
      ]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: result === 'lower' ? theme.textSecondary : theme.primary,
            width: `${getStatFraction(value) * 100}%`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  row: {
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  label: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  value: {
    minWidth: VALUE_WIDTH,
    fontSize: 14,
    lineHeight: 18,
  },
  track: {
    flex: 1,
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden',
  },
  bar: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
  },
});
