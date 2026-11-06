/** Combining accent marks, left over after `normalize('NFD')` splits `é` into `e` + `´`. */
const ACCENTS = /[̀-ͯ]/g;
const NOT_LETTER_OR_DIGIT = /[^a-z0-9]/g;

/**
 * The form both the query and the API slug are compared in: accents folded,
 * lowercase, only `a–z` and `0–9`. `Mr. Mime` → `mrmime`, `Flabébé` → `flabebe`.
 */
export function normalizeSearchText(text: string): string {
  return text.normalize('NFD').replace(ACCENTS, '').toLowerCase().replace(NOT_LETTER_OR_DIGIT, '');
}

/**
 * The Pokémon whose name contains the query anywhere, in list order. A query
 * that normalizes to nothing returns `list` itself (same reference).
 */
export function searchPokemon<T extends { name: string }>(list: readonly T[], query: string): readonly T[] {
  const normalizedQuery = normalizeSearchText(query);
  if (normalizedQuery.length === 0) {
    return list;
  }
  return list.filter((pokemon) => normalizeSearchText(pokemon.name).includes(normalizedQuery));
}
