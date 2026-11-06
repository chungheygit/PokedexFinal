import { skipToken, useQuery } from '@tanstack/react-query';

import { type EvolutionChainResponse, fetchEvolutionChain } from '@/services/pokemon-api';
import { flattenEvolutionChain } from '@/utils/evolution';

function selectEntries(data: EvolutionChainResponse) {
  return flattenEvolutionChain(data.chain);
}

/**
 * An evolution chain as a flat list by stage, keyed by chain id so every
 * Pokémon in the chain shares one request. Waits until the id is known.
 */
export function useEvolutionChain(chainId: number | undefined) {
  return useQuery({
    queryKey: ['evolution-chain', chainId],
    queryFn: chainId === undefined ? skipToken : () => fetchEvolutionChain(chainId),
    select: selectEntries,
    staleTime: Infinity,
    retry: 1,
  });
}
