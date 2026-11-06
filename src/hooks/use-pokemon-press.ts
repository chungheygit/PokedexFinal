import { router } from 'expo-router';
import { useCallback } from 'react';
import { Keyboard } from 'react-native';

import { type ComparePokemon, useComparePick } from '@/hooks/use-compare-pick';
import { getCompareHref, getPokemonHref } from '@/utils/pokemon';

/**
 * What a tap on a Pokémon card does, the same on both tabs: open the detail,
 * or while picking a second Pokémon to compare, open the compare screen. The
 * first Pokémon itself does nothing then.
 */
export function usePokemonPress(): (pokemon: ComparePokemon) => void {
  const { first, cancel } = useComparePick();

  return useCallback(
    (pokemon: ComparePokemon) => {
      if (first?.id === pokemon.id) {
        return;
      }
      Keyboard.dismiss();
      if (first) {
        cancel();
        router.push(getCompareHref(first, pokemon));
      } else {
        router.push(getPokemonHref(pokemon.id, pokemon.name));
      }
    },
    [first, cancel],
  );
}
