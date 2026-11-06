export const API_URL = 'https://pokeapi.co/api/v2';

export type NamedApiResource = {
  name: string;
  url: string;
};

type PokemonListResponse = {
  count: number;
  results: NamedApiResource[];
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
