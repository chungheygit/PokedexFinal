export const API_URL = 'https://pokeapi.co/api/v2';

export type NamedApiResource = {
  name: string;
  url: string;
};

type PokemonListResponse = {
  count: number;
  results: NamedApiResource[];
};

/** `/pokemon/{id}`, only the fields the app uses. */
export type PokemonResponse = {
  id: number;
  name: string;
  is_default: boolean;
  base_experience: number | null;
  /** Decimetres. */
  height: number;
  /** Hectograms. */
  weight: number;
  types: { slot: number; type: NamedApiResource }[];
  abilities: { ability: NamedApiResource; is_hidden: boolean; slot: number }[];
  stats: { base_stat: number; stat: NamedApiResource }[];
  species: NamedApiResource;
};

/** `/pokemon-species/{id}`, only the fields the app uses. */
export type PokemonSpeciesResponse = {
  id: number;
  name: string;
  names: { name: string; language: NamedApiResource }[];
  evolution_chain: { url: string } | null;
};

export type EvolutionChainLink = {
  species: NamedApiResource;
  evolves_to: EvolutionChainLink[];
};

/** `/evolution-chain/{id}`, only the fields the app uses. */
export type EvolutionChainResponse = {
  id: number;
  chain: EvolutionChainLink;
};

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`PokeAPI ${path} failed with status ${response.status}`);
  }
  const data: T = await response.json();
  return data;
}

/** Name and url of every Pokémon, forms included, in one request. */
export async function fetchPokemonList(): Promise<NamedApiResource[]> {
  const data = await getJson<PokemonListResponse>('/pokemon?limit=100000');
  return data.results;
}

/** One Pokémon or form: types, stats, sizes, abilities and its species link. */
export function fetchPokemon(id: number): Promise<PokemonResponse> {
  return getJson<PokemonResponse>(`/pokemon/${id}`);
}

/**
 * A species, by the id from `species.url` of a Pokémon (never by the Pokémon
 * id: forms like 10034 have no species of their own).
 */
export function fetchPokemonSpecies(speciesId: number): Promise<PokemonSpeciesResponse> {
  return getJson<PokemonSpeciesResponse>(`/pokemon-species/${speciesId}`);
}

/** An evolution chain, by the id from `evolution_chain.url` of a species. */
export function fetchEvolutionChain(chainId: number): Promise<EvolutionChainResponse> {
  return getJson<EvolutionChainResponse>(`/evolution-chain/${chainId}`);
}
