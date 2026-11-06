import { useQuery } from '@tanstack/react-query';

import { fetchPokemonList, type NamedApiResource } from '@/services/pokemon-api';
import { getIdFromUrl } from '@/utils/pokemon';

export type PokemonListItem = {
  id: number;
  name: string;
};

function toListItems(results: NamedApiResource[]): PokemonListItem[] {
  return results.map((result) => ({ id: getIdFromUrl(result.url), name: result.name }));
}

/** Every Pokémon. Search reuses the same cache through the same key. */
export function usePokemonList() {
  return useQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: fetchPokemonList,
    select: toListItems,
    staleTime: Infinity,
    retry: 1,
  });
}
