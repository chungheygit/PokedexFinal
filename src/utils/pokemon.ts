const SPRITE_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

/** Stat value that fills the whole bar. A few Pokémon go above it. */
const MAX_STAT = 150;

/** `https://pokeapi.co/api/v2/pokemon/25/` → `25`. */
export function getIdFromUrl(url: string): number {
  const match = /\/(\d+)\/?$/.exec(url);
  if (!match) {
    throw new Error(`No Pokémon id in url: ${url}`);
  }
  return Number(match[1]);
}

/** The `id` route param → `25`, or `undefined` if it is not a positive whole number. */
export function parsePokemonId(param: string | undefined): number | undefined {
  if (param === undefined || !/^\d+$/.test(param)) {
    return undefined;
  }
  const id = Number(param);
  return id > 0 ? id : undefined;
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

/** Large official artwork, used on the detail screen. Some forms have none. */
export function getArtworkUrl(id: number): string {
  return `${SPRITE_BASE_URL}/other/official-artwork/${id}.png`;
}

/** Hectograms → `6.9 kg`, `100.0 kg`. */
export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`;
}

/** Decimetres → `0.7 m`. */
export function formatHeight(decimetres: number): string {
  return `${(decimetres / 10).toFixed(1)} m`;
}

/** `64` → `64 XP`; `null` → `—`. */
export function formatBaseExperience(xp: number | null): string {
  return xp === null ? '—' : `${xp} XP`;
}

/** How much of the stat bar is filled: value ÷ 150, never more than full. */
export function getStatFraction(value: number): number {
  return Math.min(Math.max(value / MAX_STAT, 0), 1);
}
