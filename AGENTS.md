# Pokédex

A Pokédex for anyone who wants to look up a Pokémon quickly: browse all
Pokémon, search by name, see the details of each one, keep your favorites and
compare two Pokémon side by side. Live data from PokeAPI, design from the Figma.

## Core action

Look up a Pokémon.

## Features

1. [Pokémon list](./features/list.md): all ~1300 Pokémon in a grid of cards, live from the API.
2. [Search](./features/search.md): find any Pokémon by part of its name while you type.
3. [Detail](./features/detail.md): name, number, artwork, types, and three tabs: about, stats and evolution chain.
4. [Favorites](./features/favorites.md): save and remove favorites, own tab, still there after a restart.
5. [Compare](./features/compare.md): put two Pokémon side by side and see who is stronger per stat.

## Data

- **API**: [PokeAPI](https://pokeapi.co/docs/v2). Public, no key, no login.
- **Endpoints**:
  - `/pokemon?limit=100000`: names and URLs of all Pokémon in one request. Used for the list and for search. The id comes from the URL.
  - `/pokemon/{id}`: types, stats, height, weight, base experience, abilities. Used for detail and compare.
  - `/pokemon-species/{id}`: the link to the evolution chain.
  - `/evolution-chain/{id}`: the evolution chain.
  - Images by id from the PokeAPI sprites repo: the sprite for cards, the official artwork for detail.
- **Stored on the phone**: table `favorites` in SQLite: `id`, `name`, `created_at`.

## Design

Follow the Figma closely. Shared across all screens:
- Font: Rubik (Regular, Medium, SemiBold, Bold) from `fonts.zip`, loaded with expo-font.
- Colours: purple accent, light blue background, white cards. Every Pokémon type has its own colour (Grass green, Fire red, ...).
- Cards: rounded corners, soft shadow, purple number badge (#001).
- All colours, spacing and radius in `src/constants/theme.ts`.

## Technical choices

- **Stored in SQLite**: the favorites, not the Pokémon data. Pokémon data
  comes live from the API and is cached by TanStack Query; favorites are the
  only thing that is the user's own. SQLite, not AsyncStorage, because I sort
  favorites by date added and check for duplicates on `id`.
- **Native feature**: Share, with the Share API from React Native. In the ⋮
  options menu on a card and on the detail screen, it shares a text like
  "Check out Pikachu (#025)!". The alternative was haptics on favoriting; I
  picked Share because it is already in the Figma.
- **Search**: PokeAPI has no search endpoint. The full name list is loaded
  once (one request, the same one the list uses) and filtered on the phone. The
  alternative, one request per Pokémon, is far too slow for ~1300 Pokémon.

## Technical core

- [ ] Runs in Expo Go
- [ ] Live data through TanStack Query
- [ ] At least 2 screens with Expo Router
- [ ] Something in SQLite that survives a restart: favorites
- [ ] Loading and error state on every load
- [ ] One native feature: Share, in the options menu and on the detail screen
- [ ] TypeScript and ESLint without errors
- [ ] UI, data and logic in separate files

## Optional

- [ ] Three different Reanimated animations, each with a purpose
- [ ] Dark mode: every screen looks right, all colours from the theme
- [ ] Pagination: page by page while you scroll, not all at once
- [ ] Clean TypeScript: no `any`, no `as` casts, no `@ts-ignore`
- [ ] Localization: two languages
- [ ] No warnings: no `console.log`, none in the terminal or on screen
- [ ] Offline: works in airplane mode with the last data
- [ ] Tests: one per feature on the logic, `npm test` passes
- [ ] CI: lint and tsc on every push
- [ ] Accessibility: button labels, largest text size
- [ ] Optimistic update

## Out of scope

- Accounts, login or sync between phones.
- Battles, moves, items, abilities in detail.
- Forms, shiny versions or other variants of a Pokémon.
- Filtering or sorting by type, generation or stat.
- Other languages than English.
- A web version.