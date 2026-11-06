# Search

## Goal

Find any Pokémon by typing part of its name, so I don't have to scroll through 1300 cards.

## Constraints

- On the home screen `src/app/(tabs)/index.tsx`, no new screen. Layout as in `specs/design/home.png` (search field above "All Pokémon") and `specs/design/search.png` (while searching).
- Data: the list that is already loaded, `usePokemonList` with key `['pokemon', 'list']`. No new request, and no request per keystroke: PokeAPI has no search endpoint.
- The matching is a pure function in `src/utils/`, so it can be tested on its own. No debounce: filtering ~1300 names takes well under a millisecond.
- Results use the same `PokemonGrid`, `PokemonCard` and `PokemonOptionsMenu` as the list. No new card, no second grid. `PokemonGrid` gets an optional title: without one there is no 64 header, and `getItemLayout` must not count it.
- Reuse the theme and Rubik. No new dependencies.

### Search field

- Fixed at the top of the home screen, above the list: it does not scroll, so you can search from anywhere in the list.
- A rounded field in the theme's `card` colour (white in the Figma; no hex in the component), height 48, `Radius` from the theme, 24 from the screen edges like the cards. A search icon on the left and the placeholder "Search for Pokémon.." in `textSecondary`.
- Icons from expo-symbols, the same back arrow as the detail screen (iOS `arrow.left`, Android `arrow_back`); check that the `md` glyph for search is in the bundled font, otherwise export it from the Figma.
- Keyboard: no autocorrect, no auto-capitalize, return key "search". The return key closes the keyboard and keeps the results.
- Accessibility: the field has the label "Search for Pokémon", the back arrow is a button with the label "Clear search".

### Search mode

- Search mode starts when the field gets focus. Then the title "All Pokémon" is hidden, the search icon becomes a back arrow, and a 1 px line in `divider` shows under the field area, as in `search.png`.
- Search mode ends only with the back arrow or the Android back button: they clear the text, close the keyboard, leave search mode and show the full list from the top. Losing focus (scrolling, the return key) does not end it, so the title never pops back in mid-scroll.
- Scrolling the results closes the keyboard.
- With an empty field (or only spaces) in search mode, the grid shows the full list, without the title.
- The grid scrolls back to the top when the results change, so you always see the first match.
- Opening a result and coming back, or switching to Favorites and back, keeps the text, the results and search mode (keyboard closed).

### Matching

- Part of the name is enough, anywhere in the name: "pika" finds Pikachu, "chu" finds Pikachu and Raichu.
- The query and the API slug are both normalized the same way: lowercase, accents folded (é → e), then everything that is not a letter a–z or a digit dropped. So case, spaces, dashes, dots, apostrophes and other symbols do not matter: "mr mime", "Mr. Mime" and "mr-mime" find Mr Mime; "Flabébé" finds Flabebe; "farfetch'd" finds Farfetchd; "type: null" finds Type Null.
- A query that normalizes to nothing (empty, only spaces or symbols) shows the full list.
- Results keep the list order (by number, forms #10001+ after the base Pokémon). No ranking: "mew" shows Mewtwo (#150) before Mew (#151).

## Acceptance Criteria

- [ ] A search field as in the Figma, above "All Pokémon", with the placeholder "Search for Pokémon..". It stays at the top while the list scrolls.
- [ ] The field is 24 from the screen edges like the cards, in the theme's `card` colour; no hex codes in components.
- [ ] Focusing the field hides "All Pokémon", turns the search icon into a back arrow and shows the divider line, as in `search.png`.
- [ ] Results show while you type, in the same grid and cards as the list (same card size, 24 edge, 16 gap, a lone last card half width).
- [ ] "pika", "PIKA" and "Pika" all find Pikachu. "mr mime" and "Mr. Mime" find Mr Mime. "flabébé" finds Flabebe.
- [ ] It finds every Pokémon, also one you have not scrolled to yet (e.g. "dustox", #269).
- [ ] No match shows the text "No Pokémon found for "xyz"." (the text as typed, trimmed) instead of the grid.
- [ ] Scrolling the results closes the keyboard and does not leave search mode.
- [ ] The back arrow (or Android back) clears the search, closes the keyboard and shows the full list again from the top, with the title.
- [ ] Tapping a result opens its detail; coming back still shows the same search. The options menu works on results too.
- [ ] While the list is loading or failed, the field is shown but disabled, and the list's spinner or `ErrorView` shows under it.
- [ ] `npx expo lint` and `npx tsc --noEmit` without errors.

## Out of Scope

- Search by number or by type.
- Search on the Favorites tab.
- Search history or suggestions.
- Ranking results (starts-with first, best match first).
- A clear (×) button in the field; the back arrow clears.
- Restoring the scroll position of the full list after a search.
- Searching other languages than English, or the official names (e.g. "Nidoran♀" only finds by its slug letters, "nidoran").
- Tests and a test runner (jest-expo) for the matcher: a separate testing issue.
