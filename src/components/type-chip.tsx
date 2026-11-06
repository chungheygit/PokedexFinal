import { StyleSheet, Text, View } from 'react-native';

import { Fonts, getTypeColor, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatName } from '@/utils/pokemon';

const DOT_SIZE = 8;
export const TYPE_CHIP_HEIGHT = 32;

type TypeChipProps = {
  /** Type slug, e.g. `grass`. */
  type: string;
};

/** A pill with a dot in the type's colour and its name: `● Grass`. */
export function TypeChip({ type }: TypeChipProps) {
  const theme = useTheme();

  return (
    <View style={[styles.chip, { backgroundColor: theme.chip }]}>
      <View
        style={[styles.dot, { backgroundColor: getTypeColor(type, theme.textSecondary) }]}
      />
      <Text style={[styles.label, { color: theme.text }]}>{formatName(type)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: TYPE_CHIP_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.l,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
});
