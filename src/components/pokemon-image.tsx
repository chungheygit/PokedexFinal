import { Image } from 'expo-image';
import { useState } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type PokemonImageProps = {
  uri: string;
  /** Size and position of the image box. */
  style?: StyleProp<ViewStyle>;
  /** Size of the Pokéball shown when the image fails to load. */
  placeholderSize: number;
};

/**
 * A Pokémon sprite or artwork that falls back to the grey Pokéball when the
 * image is missing (some forms have none), so it never shows a broken image.
 */
export function PokemonImage({ uri, style, placeholderSize }: PokemonImageProps) {
  const theme = useTheme();
  // Remember which url failed, so a new url gets a fresh try.
  const [failedUri, setFailedUri] = useState<string | null>(null);

  return (
    <View style={[styles.box, style]}>
      {failedUri === uri ? (
        <Image
          source={require('@/assets/images/tabIcons/pokeball.png')}
          style={{ width: placeholderSize, height: placeholderSize }}
          tintColor={theme.textSecondary}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Image
          source={uri}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
          onError={() => setFailedUri(uri)}
          accessibilityIgnoresInvertColors
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
