import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useComparePick } from '@/hooks/use-compare-pick';
import { useTheme } from '@/hooks/use-theme';
import { formatName } from '@/utils/pokemon';

const ICON_SIZE = 20;

/**
 * The purple strip at the top of both tabs while picking a second Pokémon to
 * compare. Renders nothing when not picking. Put it first inside the screen's
 * top safe area, so it sits right under the status bar and pushes the rest down.
 */
export function CompareBanner() {
  const theme = useTheme();
  const { first, cancel } = useComparePick();

  if (!first) {
    return null;
  }

  return (
    <View style={[styles.banner, { backgroundColor: theme.primary }]}>
      <Text style={[styles.text, { color: theme.onPrimary }]}>
        Pick a Pokémon to compare with {formatName(first.name)}
      </Text>
      <Pressable
        onPress={cancel}
        accessibilityRole="button"
        accessibilityLabel="Cancel compare"
        hitSlop={Spacing.two}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
        {/* `close` (U+E5CD) is in the bundled Material Symbols font. */}
        <SymbolView
          name={{ ios: 'xmark', android: 'close', web: 'close' }}
          size={ICON_SIZE}
          tintColor={theme.onPrimary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three - Spacing.one,
  },
  text: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
});
