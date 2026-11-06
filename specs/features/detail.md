# Pokémon detail

## Goal

See everything about one Pokémon: its artwork, types, base info, stats and evolution chain, so I know what it is and what it evolves into.

## Constraints

- Replaces the stub `src/app/pokemon/[id].tsx`. Reachable from the list (tap a card, or "Open Pokémon" in the ⋮ menu) and from the evolution chain.
- Layout as in `specs/design/detail-about.png`, `detail-stats.png`, `detail-evolution.png` and `detail-scroll.png` (Android). `detail-scroll.png` has the Evolution tab underlined over About content: a Figma mistake, the underline follows the content.
- Reuse what the list set up: the theme, Rubik, `ErrorView`, the API service in `src/services/`, the helpers in `src/utils/`. No new dependencies (Reanimated is already in the project).

### Route

- `/pokemon/{id}?name={slug}`. `name` is the API slug (`mr-mime`) the caller already has: the list card, the ⋮ menu and the evolution cards pass it. The list's `onPress` and "Open Pokémon" change to add it.
- `name` is optional: without it (deep link), the header shows nothing until the Pokémon loads.
- An id that is not a number, or one the API answers with 404, shows `ErrorView`.

### Data

- Pokémon: `https://pokeapi.co/api/v2/pokemon/{id}`: name, id, `is_default`, types, height, weight, base experience, abilities, stats, and `species.url`.
- Species: the `species.url` from the Pokémon above (not `/pokemon-species/{id}`: forms like 10034 have no species page of their own; its species is 6, Charizard). Gives the official English name (`names`, language `en`) and `evolution_chain.url`.
- Evolution chain: the `evolution_chain.url` from the species.
- Artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`. Some forms have none (10264 is a 404): then the Pokéball PNG tinted `textSecondary`, as on the card. Never a broken image.
- Each request is its own TanStack Query hook, keyed by its own id (a number, never the route string):
  - `['pokemon', id]`
  - `['species', speciesId]` (id from `species.url`), so Charizard and Mega X share one request.
  - `['evolution-chain', chainId]` (id from `evolution_chain.url`), so Pichu, Pikachu and Raichu share one request.
- `staleTime: Infinity` and `retry: 1`, as the list. The species query waits for the Pokémon, the chain query for the species (`enabled`).
- The service functions go in `src/services/pokemon-api.ts`, next to `fetchPokemonList`, typed with only the fields we use.

### Header and tabs

- Light blue top area with ←, the name, the number (`001`, no `#`) and the type chips (coloured dot + type name, `Grass`).
- The name:
  - Before the Pokémon loads: `formatName` of the `name` param (`Mr Mime`).
  - Default Pokémon (`is_default: true`): the official name from the species (`Mr. Mime`, `Ho-Oh`) once it loads.
  - Forms (`is_default: false`): `formatName(pokemon.name)` (`Charizard Mega X`), since the species name (`Charizard`) would hide the form.
  - If the species fails: stays on `formatName`.
- The artwork sits centred under the chips and overlaps the edge between the light blue top and the white content, as in the Figma.
- Scrolling: the whole screen scrolls as one. As the big name scrolls away, a compact header (← and the name centred, light blue) fades in with Reanimated, as in `detail-scroll.png`. The tab bar sticks under the compact header. This is one of the optional Reanimated animations: it shows where you are once the big name is gone.
- Three tabs: About, Stats, Evolution. Switching is instant (no new request, no navigation, no scroll jump past the tab bar). The active tab has the purple underline and `text` colour, the others `textSecondary`. A new detail screen always opens on About.
- Type colours: one per type, all 18, in `theme.ts` (`TypeColors`). Grass, poison, fire and electric are from the Figma; the other 14 are the usual type hues at the same strength:

  | Type | Hex | Type | Hex | Type | Hex |
  | --- | --- | --- | --- | --- | --- |
  | normal | `#9DA0AA` | fire | `#FF5475` | water | `#4A90DA` |
  | grass | `#62B957` | electric | `#FFCF00` | ice | `#61CEC0` |
  | fighting | `#D04164` | poison | `#A074BF` | ground | `#DD7748` |
  | flying | `#748FC9` | psychic | `#EA5D60` | bug | `#8CB230` |
  | rock | `#BAAB82` | ghost | `#556AAE` | dragon | `#0F6AC0` |
  | dark | `#58575F` | steel | `#417D9A` | fairy | `#ED6EC7` |

  An unknown type name (e.g. a future `stellar`) gets `textSecondary`, no crash.

### About

- Rows, label left, value right:
  - Name: the same name as the header.
  - ID: `001`.
  - Base: `64 XP`. `—` if the API gives `null`.
  - Weight: hectograms ÷ 10, always one decimal with a dot: `6.9 kg`, `100.0 kg`. (The Figma's `7,0 kg` is placeholder data.)
  - Height: decimetres ÷ 10, same format: `0.7 m`.
  - Types: `Grass, Poison`.
  - Abilities: the non-hidden abilities, `formatName`, comma-separated: `Overgrow`, `Solar Power`. Hidden abilities left out, as in the Figma.
- The number formatting (weight, height) is a pure helper in `src/utils/pokemon.ts`.

### Stats

- HP, Attack, Defense, Special Attack, Special Defense, Speed, in that order, with those labels. Each: label, value on the right, a purple bar below. Bar length = value ÷ 150, never more than full (a few Pokémon go above 150). That matches the bar lengths in `detail-stats.png`.

### Evolution

- Every Pokémon in the chain as a card (sprite, number badge, name), joined by a dotted line, as in `detail-evolution.png`.
- Order by stage: the base, then every stage-2, then every stage-3 (Wurmple, Silcoon, Cascoon, Beautifly, Dustox; Eevee, then its 8 evolutions). Turning the chain tree into this list is a pure helper in `src/utils/`.
- Card id: `getIdFromUrl` of the species url (a species id is its default Pokémon's id). Name: `formatName` of the slug (`Mr Mime`), no extra request per card. Sprite: `getSpriteUrl`, with the Pokéball placeholder if it fails.
- The current Pokémon is in the chain too, not highlighted (as in the Figma). Tapping it does nothing. Tapping another one pushes its detail (`/pokemon/{id}?name={slug}`), so ← goes back to the Pokémon you came from.
- A form shows its species' chain (Mega X shows Charmander, Charmeleon, Charizard).
- A Pokémon without evolutions shows its one card and the text "This Pokémon does not evolve."
- Accessibility: each card has the label "Pikachu, number 25".

### Loading and errors

- Pokémon loading: the header shows the early name, the content area a spinner. Pokémon fails: `ErrorView` with "Try again" in the content area; ← keeps working.
- Species or chain loading: only the Evolution tab shows a spinner. Either fails: only the Evolution tab shows `ErrorView`; "Try again" refetches the one that failed. About and Stats keep working.

## Acceptance Criteria

- [ ] The header shows the name, the number (`001`), the type chips in their type colour and the artwork, as in the Figma. Bulbasaur shows "Bulbasaur", 122 shows "Mr. Mime", 10034 shows "Charizard Mega X".
- [ ] Opened from the list, the name is there at once (from `?name=`), then becomes the official name without a layout jump.
- [ ] On scroll the compact header (← and centred name) fades in and the tab bar sticks under it.
- [ ] About shows name, ID, base XP, weight (`6.9 kg`), height (`0.7 m`), types and abilities (no hidden ones).
- [ ] Stats shows the six stats with value and purple bar (value ÷ 150, max full).
- [ ] Evolution shows the whole chain as cards, by stage. Eevee shows all 8 evolutions after Eevee. Wurmple shows Wurmple, Silcoon, Cascoon, Beautifly, Dustox. A Pokémon without evolutions shows one card and "This Pokémon does not evolve."
- [ ] Tapping another Pokémon in the chain opens its detail on About; ← goes back to the previous one.
- [ ] Switching tabs is instant. Opening the same Pokémon again, or another one in the same chain, does not show a spinner for the data already loaded.
- [ ] A spinner while loading and an error with "Try again" when it fails, for the Pokémon and, separately, for species/chain (the error shows in the Evolution tab; About and Stats stay usable).
- [ ] A form like Charizard Mega X (10034) opens without errors and shows its own types and stats; a form without artwork (10264) shows the Pokéball placeholder.
- [ ] Type colours come from `TypeColors` in `theme.ts`; no hex codes in components.
- [ ] Accessibility: ← has the label "Back", evolution cards "Pikachu, number 25", tabs have the tab role and selected state.
- [ ] `AGENTS.md` lists the new shared pieces: the detail hooks and their keys, `TypeColors`, the new helpers.
- [ ] `npx expo lint` and `npx tsc --noEmit` without errors.

## Out of Scope

- The heart button: built by the favorites feature, see `favorites.md`.
- Share on the detail screen: the Figma detail has no share button. Share is in the ⋮ menu on the list.
- Evolution conditions (level, item, trade), moves, locations, shiny or form switching.
- Official names on the evolution cards (would need a species request per card).
- Dark mode colours.
