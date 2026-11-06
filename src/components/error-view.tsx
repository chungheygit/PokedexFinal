import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ErrorViewProps = {
  message: string;
  /** Shows a "Try again" button. Leave out when retrying cannot help (e.g. an invalid id). */
  onRetry?: () => void;
};

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primary, opacity: pressed ? 0.6 : 1 },
          ]}>
          <Text style={[styles.buttonText, { color: theme.onPrimary }]}>Try again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  message: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.m,
  },
  buttonText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
});
