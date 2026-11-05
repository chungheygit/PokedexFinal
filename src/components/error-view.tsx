import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ErrorViewProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.badge, opacity: pressed ? 0.6 : 1 },
        ]}>
        <Text style={[styles.buttonText, { color: theme.badgeText }]}>Try again</Text>
      </Pressable>
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
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.m,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});