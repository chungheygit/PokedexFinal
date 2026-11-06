import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PokemonImage } from '@/components/pokemon-image';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { EvolutionEntry } from '@/utils/evolution';
import { formatName, formatNumber, getSpriteUrl } from '@/utils/pokemon';

export const EVOLUTION_CARD_HEIGHT = 88;
/** Width of the sprite area; the dotted line runs under its centre. */
export const EVOLUTION_SPRITE_WIDTH = 80;

type EvolutionCardProps = {
  entry: EvolutionEntry;
  /** Leave out for the current Pokémon: tapping it does nothing. */
  onPress?: (entry: EvolutionEntry) => void;
};

/** Sprite, number badge and name of one Pokémon in an evolution chain. */
export function EvolutionCard({ entry, onPress }: EvolutionCardProps) {
  const theme = useTheme();
  const name = formatName(entry.name);

  return (
    <Pressable
      onPress={onPress ? () => onPress(entry) : undefined}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${name}, number ${entry.id}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.card, shadowColor: theme.text, opacity: pressed ? 0.7 : 1 },
      ]}>
      <View style={[styles.spriteArea, { backgroundColor: theme.cardTop }]}>
        <PokemonImage
          uri={getSpriteUrl(entry.id)}
          style={styles.sprite}
          placeholderSize={Spacing.five}
        />
      </View>
      <View style={styles.info}>
        <View style={[styles.badge, { backgroundColor: theme.primary }]}>
          <Text style={[styles.badgeText, { color: theme.onPrimary }]}>
            {formatNumber(entry.id)}
          </Text>
        </View>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {name}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    height: EVOLUTION_CARD_HEIGHT,
    borderRadius: Radius.m,
    // Shadow as in the Figma: iOS uses the shadow props, Android elevation.
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  spriteArea: {
    width: EVOLUTION_SPRITE_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: Radius.m,
    borderBottomLeftRadius: Radius.m,
  },
  sprite: {
    width: EVOLUTION_SPRITE_WIDTH - Spacing.two,
    height: EVOLUTION_SPRITE_WIDTH - Spacing.two,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
  },
  badge: {
    paddingHorizontal: Spacing.one + Spacing.half,
    paddingVertical: Spacing.half,
    borderRadius: Radius.s / 2,
  },
  badgeText: {
    fontFamily: Fonts.medium,
    fontSize: 10,
  },
  name: {
    alignSelf: 'stretch',
    fontFamily: Fonts.semiBold,
    fontSize: 16,
  },
});
