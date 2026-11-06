import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatName, formatNumber, getSpriteUrl } from '@/utils/pokemon';

const BOTTOM_HEIGHT = 48;
const PLACEHOLDER_SIZE = 48;

/**
 * The card fills its parent's width; the image part is square and the name
 * strip is 48 high. Lists use this for `getItemLayout`.
 */
export function getPokemonCardHeight(width: number): number {
  return width + BOTTOM_HEIGHT;
}

export type PokemonCardProps = {
  id: number;
  name: string;
  onPress: (pokemon: { id: number; name: string }) => void;
  onOptionsPress: (pokemon: { id: number; name: string }) => void;
};

function PokemonCardComponent({ id, name, onPress, onOptionsPress }: PokemonCardProps) {
  const theme = useTheme();
  const [spriteFailed, setSpriteFailed] = useState(false);
  const displayName = formatName(name);

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Pressable
        onPress={() => onPress({ id, name })}
        accessibilityRole="button"
        accessibilityLabel={`${displayName}, number ${id}`}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
        <View style={[styles.top, { backgroundColor: theme.cardTop }]}>
          {spriteFailed ? (
            <Image
              source={require('@/assets/images/tabIcons/pokeball.png')}
              style={styles.placeholder}
              tintColor={theme.textSecondary}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <Image
              source={getSpriteUrl(id)}
              style={styles.sprite}
              contentFit="contain"
              recyclingKey={String(id)}
              onError={() => setSpriteFailed(true)}
            />
          )}
          <View style={[styles.badge, { backgroundColor: theme.primary }]}>
            <Text style={[styles.badgeText, { color: theme.onPrimary }]}>{formatNumber(id)}</Text>
          </View>
        </View>
        <View style={styles.bottom}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {displayName}
          </Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => onOptionsPress({ id, name })}
        accessibilityRole="button"
        accessibilityLabel={`Options for ${displayName}`}
        hitSlop={Spacing.two}
        style={({ pressed }) => [styles.options, { opacity: pressed ? 0.5 : 1 }]}>
        <SymbolView
          name={{ ios: 'ellipsis', android: 'more_vert' }}
          size={20}
          tintColor={theme.text}
        />
      </Pressable>
    </View>
  );
}

export const PokemonCard = memo(PokemonCardComponent);

const OPTIONS_SIZE = 32;

const styles = StyleSheet.create({
  // Fills the width of its parent; the list decides how wide that is.
  card: {
    borderRadius: Radius.m,
    overflow: 'hidden',
  },
  top: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: {
    width: '75%',
    aspectRatio: 1,
  },
  placeholder: {
    width: PLACEHOLDER_SIZE,
    height: PLACEHOLDER_SIZE,
  },
  badge: {
    position: 'absolute',
    top: Spacing.two,
    left: Spacing.two,
    paddingHorizontal: Spacing.one + Spacing.half,
    paddingVertical: Spacing.half,
    borderRadius: Radius.s / 2,
  },
  badgeText: {
    fontFamily: Fonts.medium,
    fontSize: 10,
  },
  bottom: {
    height: BOTTOM_HEIGHT,
    justifyContent: 'center',
    paddingLeft: Spacing.three,
    paddingRight: Spacing.two + OPTIONS_SIZE,
  },
  name: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
  },
  options: {
    position: 'absolute',
    right: Spacing.one,
    bottom: (BOTTOM_HEIGHT - OPTIONS_SIZE) / 2,
    width: OPTIONS_SIZE,
    height: OPTIONS_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
