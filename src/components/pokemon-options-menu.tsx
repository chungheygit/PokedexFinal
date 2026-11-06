import { router } from 'expo-router';
import { Share } from 'react-native';

import { HeartIcon } from '@/components/heart-icon';
import { OptionsMenu, type OptionsMenuItem } from '@/components/options-menu';
import { useIsFavorite, useSetFavorite } from '@/hooks/use-favorites';
import { getPokemonHref, getShareText } from '@/utils/pokemon';

type PokemonOptionsMenuProps = {
  /** The Pokémon the menu is for; kept while the menu closes so the items don't vanish. */
  pokemon: { id: number; name: string } | null;
  visible: boolean;
  onClose: () => void;
};

function sharePokemon(id: number, name: string) {
  Share.share({ message: getShareText(id, name) }).catch(() => {
    // The user closed the share sheet or sharing is unavailable: nothing to do.
  });
}

/**
 * The ⋮ menu of a Pokémon card: Open, Add/Remove favorite, Share. The favorite
 * item is left out while the favorites are loading or failed to load.
 */
export function PokemonOptionsMenu({ pokemon, visible, onClose }: PokemonOptionsMenuProps) {
  const isFavorite = useIsFavorite(pokemon?.id);
  const setFavorite = useSetFavorite();

  const items: OptionsMenuItem[] = [];
  if (pokemon) {
    const { id, name } = pokemon;
    items.push({
      key: 'open',
      label: 'Open Pokémon',
      icon: { ios: 'arrow.up.left.and.arrow.down.right', android: 'open_in_full' },
      onPress: () => router.push(getPokemonHref(id, name)),
    });
    if (isFavorite !== undefined) {
      items.push({
        key: 'favorite',
        label: isFavorite ? 'Remove from favorites' : 'Add to favorites',
        icon: ({ size, color }) => <HeartIcon filled={isFavorite} size={size} color={color} />,
        onPress: () => setFavorite({ id, name, favorite: !isFavorite }),
      });
    }
    items.push({
      key: 'share',
      label: 'Share',
      icon: { ios: 'square.and.arrow.up', android: 'share' },
      onPress: () => sharePokemon(id, name),
    });
  }

  return <OptionsMenu visible={visible} items={items} onClose={onClose} />;
}
