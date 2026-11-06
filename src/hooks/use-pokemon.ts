import { skipToken, useQuery } from '@tanstack/react-query';

import { fetchPokemon } from '@/services/pokemon-api';
import { toPokemonDetail } from '@/utils/pokemon-detail';

/** One Pokémon or form. `undefined` id (an invalid route) fetches nothing. */
export function usePokemon(id: number | undefined) {
  return useQuery({
    queryKey: ['pokemon', id],
    queryFn: id === undefined ? skipToken : () => fetchPokemon(id),
    select: toPokemonDetail,
    staleTime: Infinity,
    retry: 1,
  });
}
