# Pokédex

A Pokédex app on PokeAPI (https://pokeapi.co/api/v2, public, no key), following the Figma design. Must run in Expo Go.

- Expo Router, TanStack Query, expo-sqlite, TypeScript. No libraries that need a development build.
- Screens in `src/app/`, data through hooks in `src/hooks/`, API and SQL in `src/services/`, pure helper functions in `src/utils/`, reusable UI in `src/components/`. A screen renders, a hook gets data, a service talks to the API or the database. Nothing does two of those.
- Shared setup (API client, query client, database): reuse what is listed here, never add a second one. When you set up something new that other features will use, add a line here: what it is and where it lives.
  - Query client: `QueryClientProvider` in `src/app/_layout.tsx`.
  - Theme: colours, spacing and radius in `src/constants/theme.ts`. Never a hex code in a component.
  - Type colours: `TypeColors` in `theme.ts` (all 18 types); use `getTypeColor(type, theme.textSecondary)` so an unknown type falls back instead of crashing.
  - Error state: `src/components/error-view.tsx`. `onRetry` is optional: leave it out when retrying cannot help (an invalid id).
  - API client: `src/services/pokemon-api.ts` (`API_URL`, `fetchPokemonList`, `fetchPokemon`, `fetchPokemonSpecies`, `fetchEvolutionChain`). Add new PokeAPI calls there, typed with only the fields used.
  - Pokémon list query: `usePokemonList` in `src/hooks/use-pokemon-list.ts`, key `['pokemon', 'list']`, `{ id, name }[]`. Search reuses it.
  - Detail queries (all `staleTime: Infinity`, `retry: 1`, ids are numbers, `skipToken` while the id is unknown):
    - `usePokemon(id)` in `src/hooks/use-pokemon.ts`, key `['pokemon', id]`, returns `PokemonDetail` (types, stats rows, visible abilities, `speciesId`). Compare can reuse it.
    - `usePokemonSpecies(speciesId)` in `src/hooks/use-pokemon-species.ts`, key `['species', speciesId]`, returns `{ id, name, officialName, chainId }`. The species id comes from `species.url`, never the Pokémon id (forms share their species).
    - `useEvolutionChain(chainId)` in `src/hooks/use-evolution-chain.ts`, key `['evolution-chain', chainId]`, returns the chain flattened by stage.
  - Detail route: `/pokemon/[id]` with optional `name` (the API slug) so the header has a name at once: `router.push({ pathname: '/pokemon/[id]', params: { id: String(id), name } })`.
  - Fonts: Rubik from `assets/fonts/`, loaded in `src/app/_layout.tsx`; names in `Fonts` in `theme.ts` (`regular`, `medium`, `semiBold`, `bold`).
  - Pokémon card: `PokemonCard` in `src/components/pokemon-card.tsx`, props `{ id, name, onPress, onOptionsPress }` (both callbacks get `{ id, name }`), fills its parent's width with a square image part; `getPokemonCardHeight(width)` gives its height for `getItemLayout`.
  - Options menu: `OptionsMenu` in `src/components/options-menu.tsx`, a bottom-sheet `Modal`; render once per screen, pass `items`.
  - Formatting helpers: `src/utils/pokemon.ts` (`getIdFromUrl`, `parsePokemonId`, `formatNumber`, `formatName`, `getShareText`, `getSpriteUrl`, `getArtworkUrl`, `formatWeight`, `formatHeight`, `formatBaseExperience`, `getStatFraction`).
  - Detail helpers: `src/utils/pokemon-detail.ts` (`PokemonDetail`, `getStatRows`, `getVisibleAbilities`, `getOfficialName`, `getDisplayName`) and `src/utils/evolution.ts` (`flattenEvolutionChain`, `getEvolutionEntries`).
  - Pokémon image with fallback: `PokemonImage` in `src/components/pokemon-image.tsx`, props `{ uri, style, placeholderSize }`; shows the tinted Pokéball when the image fails. Use it for any sprite or artwork.
  - Type chip: `TypeChip` in `src/components/type-chip.tsx`, prop `type` (slug): coloured dot + name.
  - Pokéball icon: `assets/images/tabIcons/pokeball.png` (`@2x`, `@3x`), exported from the Figma. Tab icon and the card's no-sprite placeholder (tinted with `tintColor`).
- Lessons from earlier issues:
  - Before saying a UI task is done, compare sizes and spacing with the screenshots in `specs/design/` (card size, edge margins, gaps), not only colours and fonts.
  - Before using an `md` icon (Material Symbols via expo-symbols), check that the glyph is in the bundled font: a name can be in the type list but missing from the font, and then it draws a missing-glyph box. If it is missing, use a PNG from the Figma.
  - In a grid, a lone card in the last row keeps the same width as the others: give each cell a fixed share of the row (e.g. `width: '50%'`), not `flex: 1`.
  - A child of `stickyHeaderIndices` is wrapped by React Native, so its `onLayout` `y` is 0. Measure the views above it instead.
  - For a selected state use `aria-selected`, not `accessibilityState`: the web build ignores `accessibilityState`.
- Specs: `specs/product.md` describes the app, `specs/features/<name>.md` one feature each. Design screenshots are in `specs/design/`.
- For an issue: first read it with `gh issue view <number>` and read its spec file. Then post a plan (which files, how, what you are unsure about) and a `- [ ]` task list as one comment on the issue with `gh issue comment`. Wait for my go. Tick off tasks with `gh issue comment --edit-last` while you build.

---

This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md