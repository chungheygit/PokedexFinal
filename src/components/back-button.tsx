import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export const BACK_BUTTON_SIZE = 40;
const ICON_SIZE = 24;

function goBack() {
  // Opened from a deep link there is no screen to go back to: go to the list.
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}

/** The ← in a screen's own top bar (detail, compare). */
export function BackButton() {
  const theme = useTheme();

  return (
    <Pressable
      onPress={goBack}
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={Spacing.two}
      style={({ pressed }) => [styles.button, { opacity: pressed ? 0.5 : 1 }]}>
      <SymbolView
        name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
        size={ICON_SIZE}
        tintColor={theme.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: BACK_BUTTON_SIZE,
    height: BACK_BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
