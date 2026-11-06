import { skipToken, useQuery } from '@tanstack/react-query';

import { fetchPokemonSpecies } from '@/services/pokemon-api';
import { toSpeciesDetail } from '@/utils/pokemon-detail';

/**
 * A species, keyed by species id so a Pokémon and its forms share one request.
 * Waits until the id is known (from the Pokémon's `species.url`).
 */
export function usePokemonSpecies(speciesId: number | undefined) {
  return useQuery({
    queryKey: ['species', speciesId],
    queryFn: speciesId === undefined ? skipToken : () => fetchPokemonSpecies(speciesId),
    select: toSpeciesDetail,
    staleTime: Infinity,
    retry: 1,
  });
}
