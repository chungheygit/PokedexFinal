# Pokédex

A Pokédex for anyone who wants to look up a Pokémon quickly. Browse all
Pokémon, search by name, see the details of each one, keep your favorites and
compare two Pokémon side by side. Live data from PokeAPI, design from the
[Figma](https://www.figma.com/design/dsgGXcu5WELIvRW90m5308/Pokemon-Code-Challenge?node-id=0-1).

## Core action

Look up a Pokémon.

## Features

1. [Pokémon list](./features/list.md): all ~1300 Pokémon in a grid of cards, live from the API.
2. [Search](./features/search.md): find any Pokémon by part of its name while you type.
3. [Detail](./features/detail.md): name, number, artwork, types, and three tabs: about, stats and evolution chain.
4. [Favorites](./features/favorites.md): save and remove favorites in their own tab, still there after a restart.
5. [Compare](./features/compare.md): two Pokémon side by side, per stat you see who is stronger.

## Data

- **API**: [PokeAPI](https://pokeapi.co/docs/v2). Public, no key, no login.
- **Endpoints**:
  - `/pokemon?limit=100000`: name and URL of every Pokémon in one request. For the list and search. The id comes from the URL.
  - `/pokemon/{id}`: types, stats, height, weight, base experience, abilities. For detail and compare.
  - `/pokemon-species/{id}`: the link to the evolution chain.
  - `/evolution-chain/{id}`: the evolution chain.
  - Images by id from the PokeAPI sprites repo: the sprite on cards, the official artwork on detail.
- **Stored on the phone**: table `favorites` in SQLite: `id`, `name`, `created_at`.

## Technical choices

- **Stored in SQLite**: the favorites, not the Pokémon data. Pokémon data comes
  live from the API and TanStack Query caches it; favorites are the only thing
  the user makes. SQLite, not AsyncStorage, because I sort favorites by date
  added and check for duplicates on `id`.
- **Native feature**: Share, with the React Native Share API, in the ⋮ options
  menu on a card and on the detail screen. It shares a text like "Check out
  Pikachu (#025)!". The alternative was haptics when favoriting; I picked Share
  because it is already in the Figma.
- **Search**: PokeAPI has no search endpoint, and `/pokemon/{name}` only finds
  exact names. So the full name list is loaded once (the same request as the
  list) and filtered on the phone, case-insensitive. One request per keystroke
  would not find "pika".
- **Design**: the Figma colours, the type colours and the Rubik font live once
  in `src/constants/theme.ts`, set up by the first issue (the list). The
  alternative, styles per screen, drifts apart and makes dark mode impossible.

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
- Choosing between forms or shiny versions on the detail screen. The list shows every entry the API gives, forms included.
- Filtering or sorting by type, generation or stat.
- Other languages than English.
- A web version.