import type { PokemonResponse, PokemonSpeciesResponse } from '@/services/pokemon-api';
import { formatName, getIdFromUrl } from '@/utils/pokemon';

export type StatRow = {
  key: string;
  label: string;
  value: number;
};

/** What the detail screen shows of a Pokémon. */
export type PokemonDetail = {
  id: number;
  /** API slug, e.g. `charizard-mega-x`. */
  name: string;
  isDefault: boolean;
  speciesId: number;
  baseExperience: number | null;
  height: number;
  weight: number;
  /** Type slugs in slot order, e.g. `['grass', 'poison']`. */
  types: string[];
  /** Non-hidden abilities, formatted, e.g. `['Overgrow']`. */
  abilities: string[];
  stats: StatRow[];
};

export type PokemonSpeciesDetail = {
  id: number;
  name: string;
  /** English name, e.g. `Mr. Mime`. */
  officialName: string | undefined;
  /** `undefined` when the species has no evolution chain. */
  chainId: number | undefined;
};

const STAT_LABELS: [key: string, label: string][] = [
  ['hp', 'HP'],
  ['attack', 'Attack'],
  ['defense', 'Defense'],
  ['special-attack', 'Special Attack'],
  ['special-defense', 'Special Defense'],
  ['speed', 'Speed'],
];

/** The six stats in a fixed order with their labels. A missing stat counts as 0. */
export function getStatRows(stats: PokemonResponse['stats']): StatRow[] {
  return STAT_LABELS.map(([key, label]) => ({
    key,
    label,
    value: stats.find((stat) => stat.stat.name === key)?.base_stat ?? 0,
  }));
}

/** Non-hidden abilities in slot order, formatted: `['Overgrow']`. */
export function getVisibleAbilities(abilities: PokemonResponse['abilities']): string[] {
  return abilities
    .filter((ability) => !ability.is_hidden)
    .sort((a, b) => a.slot - b.slot)
    .map((ability) => formatName(ability.ability.name));
}

export function toPokemonDetail(pokemon: PokemonResponse): PokemonDetail {
  return {
    id: pokemon.id,
    name: pokemon.name,
    isDefault: pokemon.is_default,
    speciesId: getIdFromUrl(pokemon.species.url),
    baseExperience: pokemon.base_experience,
    height: pokemon.height,
    weight: pokemon.weight,
    types: [...pokemon.types].sort((a, b) => a.slot - b.slot).map((type) => type.type.name),
    abilities: getVisibleAbilities(pokemon.abilities),
    stats: getStatRows(pokemon.stats),
  };
}

/** The English name from a species: `Mr. Mime`, `Ho-Oh`. */
export function getOfficialName(species: PokemonSpeciesResponse): string | undefined {
  return species.names.find((name) => name.language.name === 'en')?.name;
}

export function toSpeciesDetail(species: PokemonSpeciesResponse): PokemonSpeciesDetail {
  return {
    id: species.id,
    name: species.name,
    officialName: getOfficialName(species),
    chainId: species.evolution_chain ? getIdFromUrl(species.evolution_chain.url) : undefined,
  };
}

/**
 * The name shown in the header and on About:
 * - before the Pokémon loads: the `name` route param, formatted (`Mr Mime`);
 * - a default Pokémon: the official species name once it loads (`Mr. Mime`);
 * - a form, or while/if the species fails: the formatted slug (`Charizard Mega X`).
 */
export function getDisplayName(
  paramName: string | undefined,
  pokemon: PokemonDetail | undefined,
  officialName: string | undefined,
): string {
  if (pokemon) {
    if (pokemon.isDefault && officialName) {
      return officialName;
    }
    return formatName(pokemon.name);
  }
  return paramName ? formatName(paramName) : '';
}
