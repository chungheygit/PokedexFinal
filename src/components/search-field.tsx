import { SymbolView } from 'expo-symbols';
import type { Ref } from 'react';
import { Pressable, StyleSheet, TextInput, type TextInputInstance, View } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const FIELD_HEIGHT = 48;
const ICON_SIZE = 24;

type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  /** Search mode: a back arrow instead of the search icon, and a line under the field. */
  searching: boolean;
  onFocus: () => void;
  /** The back arrow: clears and leaves search mode. */
  onBack: () => void;
  /** `false` while there is nothing to search yet (list loading or failed). */
  editable: boolean;
  ref?: Ref<TextInputInstance>;
};

/** The search field fixed at the top of the home screen, 24 from the screen edges. */
export function SearchField({
  value,
  onChangeText,
  searching,
  onFocus,
  onBack,
  editable,
  ref,
}: SearchFieldProps) {
  const theme = useTheme();

  return (
    <View>
      <View style={styles.area}>
        <View
          style={[
            styles.field,
            {
              backgroundColor: theme.card,
              boxShadow: `0px 2px 12px ${theme.shadow}`,
              opacity: editable ? 1 : 0.6,
            },
          ]}>
          {searching ? (
            <Pressable
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={Spacing.two}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
              <SymbolView
                name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
                size={ICON_SIZE}
                tintColor={theme.text}
              />
            </Pressable>
          ) : (
            <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
              {/* `search` (U+E8B6) is in the bundled Material Symbols font. */}
              <SymbolView
                name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
                size={ICON_SIZE}
                tintColor={theme.text}
              />
            </View>
          )}
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            editable={editable}
            placeholder="Search for Pokémon.."
            placeholderTextColor={theme.textSecondary}
            accessibilityLabel="Search for Pokémon"
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            selectionColor={theme.primary}
            style={[styles.input, { color: theme.text }]}
          />
        </View>
      </View>
      {searching && <View style={[styles.divider, { backgroundColor: theme.divider }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  field: {
    height: FIELD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.m,
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  divider: {
    height: 1,
  },
});
