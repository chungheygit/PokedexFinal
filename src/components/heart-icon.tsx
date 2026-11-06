import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

/** The heart inside a symbol's square box, as in the Material Symbols glyph (20 of 24). */
const HEART_SCALE = 20 / 24;

type HeartIconProps = {
  filled: boolean;
  size: number;
  color: string;
};

/**
 * Outline or filled heart. The outline is the system symbol; the filled heart
 * is a PNG from the Figma, because Material Symbols draws `favorite` and
 * `favorite_border` as the same outline in the bundled (unfilled) font.
 */
export function HeartIcon({ filled, size, color }: HeartIconProps) {
  if (!filled) {
    return (
      <SymbolView name={{ ios: 'heart', android: 'favorite', web: 'favorite' }} size={size} tintColor={color} />
    );
  }

  return (
    <View style={[styles.box, { width: size, height: size }]}>
      <Image
        source={require('@/assets/images/heart-filled.png')}
        style={{ width: size * HEART_SCALE, height: size * HEART_SCALE }}
        contentFit="contain"
        tintColor={color}
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
