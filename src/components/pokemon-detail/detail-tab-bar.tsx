import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type DetailTab = 'about' | 'stats' | 'evolution';

const TABS: { key: DetailTab; label: string }[] = [
  { key: 'about', label: 'About' },
  { key: 'stats', label: 'Stats' },
  { key: 'evolution', label: 'Evolution' },
];

export const DETAIL_TAB_BAR_HEIGHT = 48;
const UNDERLINE_HEIGHT = 3;

type DetailTabBarProps = {
  selected: DetailTab;
  onSelect: (tab: DetailTab) => void;
};

/** About / Stats / Evolution. The active tab has the purple underline. */
export function DetailTabBar({ selected, onSelect }: DetailTabBarProps) {
  const theme = useTheme();

  return (
    <View style={[styles.bar, { backgroundColor: theme.card }]}>
      <View style={[styles.tabs, { borderBottomColor: theme.divider }]} accessibilityRole="tablist">
        {TABS.map((tab) => {
          const isSelected = tab.key === selected;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onSelect(tab.key)}
              accessibilityRole="tab"
              aria-selected={isSelected}
              style={styles.tab}>
              <Text
                style={[
                  styles.label,
                  { color: isSelected ? theme.text : theme.textSecondary },
                ]}>
                {tab.label}
              </Text>
              <View
                style={[
                  styles.underline,
                  { backgroundColor: isSelected ? theme.primary : 'transparent' },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: DETAIL_TAB_BAR_HEIGHT,
    paddingHorizontal: Spacing.three,
  },
  tabs: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    marginBottom: Spacing.three - UNDERLINE_HEIGHT,
  },
  underline: {
    alignSelf: 'stretch',
    height: UNDERLINE_HEIGHT,
    // Sits on the divider line.
    marginBottom: -StyleSheet.hairlineWidth * 2,
  },
});
