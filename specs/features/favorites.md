# Favorites

## Goal

Save the Pokémon I like and find them back in their own tab, also after I close the app.

## Constraints

- New tab "Favorites" next to "Pokémons", screen `src/app/(tabs)/favorites.tsx`. Layout as in `specs/design/favorites.png`: title "My favorites" and the same 2-column grid as the list.
- Reuse what is there: `PokemonCard`, the grid sizes (24 edge, 16 gap, half-width last card, 64 header), `OptionsMenu`, `ErrorView`, the theme. No new dependencies (expo-sqlite is already installed).

### Storage (SQLite)

- The database is opened once, in `src/services/database.ts`: opened lazily on first use, and it creates the table if it is not there. A failed open is not remembered, so "Try again" opens it again. Add it to the shared setup in `AGENTS.md`.
- One table `favorites`: `id INTEGER PRIMARY KEY` (the Pokémon id), `name TEXT NOT NULL` (the API slug), `created_at INTEGER NOT NULL` (milliseconds, `Date.now()` from the app). Milliseconds, not `CURRENT_TIMESTAMP`: two favorites added in the same second would otherwise have no fixed order, and the optimistic item gets the same timestamp as the saved row, so nothing reorders when the database answers.
- The favorites SQL in `src/services/favorites.ts`: get all (newest first, `ORDER BY created_at DESC`), add (`INSERT OR REPLACE`, so the same Pokémon is never in the list twice), remove.
- Demo switch: `SIMULATE_SAVE_ERROR` in `src/services/favorites.ts`, `false` in the repo. Set to `true` in a dev build (`__DEV__` only), add and remove throw, so the rollback can be shown.

### Hooks (TanStack Query)

- One query, `useFavorites()` in `src/hooks/use-favorites.ts`, key `['favorites']`, returns `{ id, name, createdAt }[]`, newest first.
- `useIsFavorite(id)`: the same query with `select`, so there is no second SQL query. Returns `undefined` while loading or after an error, so callers can tell "not a favorite" from "not known yet".
- One mutation, `useSetFavorite()`, `mutationKey: ['favorites']`. It takes the state to end in, `{ id, name, favorite: boolean }`, not a toggle: the caller reads the current state and asks for the opposite, so two fast taps end where the user expects.

### Optimistic update

- Adding or removing shows at once, before the database is done: the heart button, the options menu text and the Favorites tab change immediately.
- `onMutate`: cancel running `['favorites']` fetches, keep the old list, put the new list in the cache (added on top with `createdAt: Date.now()`, or removed).
- `onError`: put the old list back and show `Alert.alert('Could not save', 'Your favorites were not changed. Please try again.')`.
- `onSettled`: invalidate `['favorites']`, but only when no other favorites mutation is still running, so quick taps don't flicker back and forth.
- Because the tab, the menu and the heart all read the one `['favorites']` cache, they cannot disagree.

### Where you can (un)favorite

- **Options menu on a card** (the ⋮ button, on the list and the Favorites tab): Open Pokémon, then "Add to favorites" or "Remove from favorites", then Share (order as in `options.png`). Icons: iOS `heart` / `heart.fill`, Android `favorite_border` / `favorite`. While the favorites are loading or failed, the favorite item is left out of the menu.
- Removing from the Favorites tab removes the card at once. No undo.
- **Heart button on the detail screen**: in the fixed top bar, right, across from ←, so it stays visible in the compact header (`detail-stats.png`, `detail-scroll.png`). Outline in `text` colour when not a favorite, filled red when it is. The red `#FF395C` (measured from `detail-stats.png`) goes in `theme.ts` as `favorite`; no hex in the component. Tapping it sets the opposite state.
- The heart is hidden until both the Pokémon (for the slug to save, `pokemon.name`) and the favorites have loaded. Its spot is fixed, so nothing moves when it appears. If the favorites fail, the heart stays hidden; the rest of the detail screen works.
- Accessibility: the heart has role button and the label "Add to favorites" or "Remove from favorites".

### Tab

- Label "Favorites", heart icon (iOS `heart`, Android `favorite`). Check that the `md` glyph exists in the font before using it; if not, export the heart from the Figma like the Pokéball.

## Acceptance Criteria

- [ ] A "Favorites" tab with a heart icon next to "Pokémons".
- [ ] The Favorites tab shows "My favorites" and the saved Pokémon in the same grid as the list (same card size, 24 edge, 16 gap), newest first.
- [ ] With no favorites: the title stays, and under it the text "No favorites yet. Tap the heart on a Pokémon, or use ⋮ → Add to favorites."
- [ ] The options menu on a card shows Open Pokémon, "Add to favorites" or "Remove from favorites", and Share, and it works from both tabs.
- [ ] The heart button on the detail screen (top right, also in the compact header) is an outline or filled red, and tapping it toggles the favorite.
- [ ] Adding or removing shows at once (optimistic), in the tab, the options menu and the heart button, without a reload. Tapping the heart quickly several times ends in the state of the last tap.
- [ ] With `SIMULATE_SAVE_ERROR = true`: the heart and tab change, then go back, and an alert says it could not be saved.
- [ ] Kill the app completely and open it again: the favorites are still there, in the same order.
- [ ] Tapping a favorite opens its detail.
- [ ] Loading: a spinner. If the database fails: `ErrorView` with "Try again", which opens the database again.
- [ ] The red is `favorite` in `theme.ts`; no hex codes in components.
- [ ] `AGENTS.md` lists the database, `useFavorites` / `useIsFavorite` / `useSetFavorite` with the key, and the `favorite` colour.
- [ ] `npx expo lint` and `npx tsc --noEmit` without errors.

## Out of Scope

- Sorting or reordering favorites, folders, notes, undo after removing.
- Sync between phones or accounts.
- Storing Pokémon data in SQLite (only `id`, `name`, `created_at`; the rest comes from the API).
- An animation on the heart button (no heart pop).
- Favorites on web (expo-sqlite on web needs extra setup; there is no web version).
