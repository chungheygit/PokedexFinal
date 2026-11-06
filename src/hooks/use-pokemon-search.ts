import { useMemo } from 'react';

import { usePokemonList } from '@/hooks/use-pokemon-list';
import { searchPokemon } from '@/utils/search';

/**
 * The loaded Pokémon list filtered by `query` on the phone (PokeAPI has no
 * search endpoint), on the same query as the list. No extra request.
 * `results` is `undefined` while the list is loading or failed.
 */
export function usePokemonSearch(query: string) {
  const { data, isError, refetch } = usePokemonList();
  const results = useMemo(() => (data ? searchPokemon(data, query) : undefined), [data, query]);
  return { results, isError, refetch };
}
