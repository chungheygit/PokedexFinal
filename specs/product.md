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
- **Search**: PokeAPI has no search 