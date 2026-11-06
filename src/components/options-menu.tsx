import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type OptionsMenuItem = {
  key: string;
  label: string;
  icon: SymbolViewProps['name'];
  onPress: () => void;
};

type OptionsMenuProps = {
  visible: boolean;
  items: OptionsMenuItem[];
  onClose: () => void;
};

/**
 * Bottom sheet with actions for one Pokémon. Render it once per screen and pass
 * the items in. Closes on backdrop tap, Android back, or picking an item.
 */
export function OptionsMenu({ visible, items, onClose }: OptionsMenuProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: theme.backdrop }]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close menu"
        />
        <Animated.View
          entering={SlideInDown.duration(250)}
          style={[
            styles.sheet,
            { backgroundColor: theme.card, paddingBottom: insets.bottom + Spacing.three },
          ]}>
          {items.map((item) => (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              onPress={() => {
                onClose();
                item.onPress();
              }}
              style={({ pressed }) => [styles.item, { opacity: pressed ? 0.5 : 1 }]}>
              <SymbolView name={item.icon} size={20} tintColor={theme.text} />
              <Text style={[styles.label, { color: theme.text }]}>{item.label}</Text>
            </Pressable>
          ))}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderTopLeftRadius: Radius.l,
    borderTopRightRadius: Radius.l,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    paddingVertical: Spacing.three,
  },
  label: {
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
});
