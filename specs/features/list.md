# Pokémon list

## Goal

See all Pokémon in a grid, so I can browse them and open the one I want.

## Constraints

- Home screen `src/app/(tabs)/index.tsx`, replaces the placeholder. Tab label "Pokémons".
- Data: `https://pokeapi.co/api/v2/pokemon?limit=100000`, one request through a TanStack Query hook. The id is the last number in each `url`. Sprite by id: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png`.
- Sets up the design for the whole app: the Rubik font with expo-font (`assets/fonts/`) and the Figma colours in `theme.ts`. Later features reuse them.
- Builds the Pokémon card as a reusable component: search and favorites reuse it.
- Design as in the Figma (screens Home and Options).
- Loading and error state with `ErrorView`.
- No new dependencies except expo-font.

## Acceptance Criteria

- [ ] Title "All Pokémon" with a grid of 2 columns of cards below it.
- [ ] Every card shows the sprite, a purple number badge (`#001`, at least 3 digits), the name with a capital letter (Bulbasaur) and a ⋮ button.
- [ ] All ~1300 Pokémon, live from the API. Scrolling to the bottom stays smooth.
- [ ] Tapping a card goes to `/pokemon/{id}`.
- [ ] ⋮ opens a menu with "Open Pokémon" and "Share". Share opens the phone's share sheet with "Check out Pikachu (#025)!".
- [ ] A spinner while loading, an error with "Try again" when it fails.

## Out of Scope

- The search bar (search feature), the detail screen itself (detail feature).
- "Add to favorites" in the ⋮ menu (favorites feature).
- Sorting, filtering, pagination.