import type { EvolutionChainLink } from '@/services/pokemon-api';
import { getIdFromUrl } from '@/utils/pokemon';

export type EvolutionEntry = {
  /** Species id, which is also the id of its default Pokémon. */
  id: number;
  /** Species slug, e.g. `mr-mime`. */
  name: string;
};

/**
 * What the Evolution tab lists: the loaded chain, or only the species itself
 * when it has no chain. `undefined` while it is still loading.
 */
export function getEvolutionEntries(
  chain: EvolutionEntry[] | undefined,
  species: { id: number; name: string; chainId: number | undefined } | undefined,
): EvolutionEntry[] | undefined {
  if (chain) {
    return chain;
  }
  if (species && species.chainId === undefined) {
    return [{ id: species.id, name: species.name }];
  }
  return undefined;
}

/**
 * The chain tree as a flat list, stage by stage: the base, then every stage-2,
 * then every stage-3. Wurmple → Wurmple, Silcoon, Cascoon, Beautifly, Dustox.
 */
export function flattenEvolutionChain(chain: EvolutionChainLink): EvolutionEntry[] {
  const entries: EvolutionEntry[] = [];
  let stage = [chain];
  while (stage.length > 0) {
    for (const link of stage) {
      entries.push({ id: getIdFromUrl(link.species.url), name: link.species.name });
    }
    stage = stage.flatMap((link) => link.evolves_to);
  }
  return entries;
}
