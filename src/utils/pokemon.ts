const SPRITE_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

/** `https://pokeapi.co/api/v2/pokemon/25/` → `25`. */
export function getIdFromUrl(url: string): number {
  const match = /\/(\d+)\/?$/.exec(url);
  if (!match) {
    throw new Error(`No Pokémon id in url: ${url}`);
  }
  return Number(match[1]);
}

/** `1` → `001`, `1025` → `1025`. */
export function formatNumber(id: number): string {
  return String(id).padStart(3, '0');
}

/** `mr-mime` → `Mr Mime`. */
export function formatName(name: string): string {
  return name
    .split('-')
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** `Check out Pikachu (#025)!` */
export function getShareText(id: number, name: string): string {
  return `Check out ${formatName(name)} (#${formatNumber(id)})!`;
}

/** Small front sprite, used on the cards. */
export function getSpriteUrl(id: number): string {
  return `${SPRITE_BASE_URL}/${id}.png`;
}
