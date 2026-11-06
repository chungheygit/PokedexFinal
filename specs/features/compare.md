# Compare

## Goal

Put two Pokémon side by side, so I can see per stat which one is stronger.

## Constraints

- The Figma has no compare screen: follow its style (light blue top area, white content, Rubik, the purple, type chips, artwork). Reuse what is there: `PokemonGrid`, `PokemonCard`, `PokemonOptionsMenu`, `usePokemon`, `usePokemonSpecies`, `getDisplayName`, `PokemonImage`, `TypeChip`, `ErrorView`, the theme. No new dependencies.
- Data: `usePokemon(id)` and `usePokemonSpecies(speciesId)` for both Pokémon, the same hooks and cache as the detail screen. No new API calls.
- Which side is higher per stat (higher, lower, tie) is a pure function in `src/utils/compare.ts`, so it can be tested on its own.

### Starting a comparison

- The options menu (⋮) on a card gets a new item "Compare", on both tabs. Order: Open Pokémon, Add/Remove favorites, Compare, Share. Icon: iOS `arrow.left.arrow.right`, Android `compare_arrows`; check that the `md` glyph is in the bundled font (see the lessons in `AGENTS.md`), otherwise export one from the Figma.
- "Compare" starts pick mode for that Pokémon (the first one).

### Pick mode (shared by both tabs)

- Pick mode is app-wide: a React Context with the first Pokémon (`{ id, name }`, or nothing). The provider goes in `src/app/_layout.tsx`, the hook in `src/hooks/`. Add it to the shared setup in `AGENTS.md`. It lives in memory only: closing the app ends it.
- While picking, both tabs show a purple banner (theme `primary`, text `onPrimary`): a full-width strip right under the status bar, above the search field on Pokémons and above "My favorites" on Favorites. It pushes the content down; no rounded corners. Text: "Pick a Pokémon to compare with {Name}", with a close button (✕) on the right. `{Name}` is the first Pokémon's list name (`formatName`), e.g. "Pick a Pokémon to compare with Bulbasaur". The close icon must exist in the icon font (see the lessons in `AGENTS.md`). The close button is a button with the label "Cancel compare".
- The banner is only on the two tabs. The detail and compare screens do not show it.
- The first Pokémon's card is dimmed (half opacity) on both tabs while picking, and its accessibility label says it is already chosen. Its ⋮ still works.
- You can switch between the Pokémons and Favorites tabs and search while picking. The banner stays.
- Tapping a card (on either tab) picks it as the second Pokémon: pick mode ends and the compare screen opens. Tapping the first Pokémon itself does nothing. Picking from search results keeps the search, as opening a detail does.
- The ⋮ menu keeps working. "Open Pokémon" opens the detail and pick mode stays: coming back, the banner is still there. "Compare" on another Pokémon replaces the first one.
- Cancel with the close button or the Android back button. If you are also searching, Android back first leaves search, and the next back cancels pick mode. Android back only does this while a tab is on screen; on a detail screen it goes back as usual.

### Compare screen

- Route `src/app/compare.tsx`: `/compare?first={id}&firstName={slug}&second={id}&secondName={slug}`. `first` and `second` are Pokémon ids (numbers); `firstName` and `secondName` are the API slugs the caller already has, so the names show at once (as the detail's `name` param). The names are optional: without them (deep link), the names wait for the data. A route helper next to `getPokemonHref` in `src/utils/pokemon.ts`.
- Opened on top of the tabs like the detail screen. Top bar with ← and the title "Compare". ← works as on the detail screen: without a screen to go back to (deep link), it goes to the list.
- The screen scrolls as one, so it also fits at the largest text size.
- Light blue top area with two columns, left the first Pokémon, right the second, "vs" in between: artwork, name, number (`001`), type chips.
  - Artwork (`PokemonImage`, by id) and number show at once. The name shows at once from the slug param.
  - The name is the same as in the detail header, via `getDisplayName`: the official name (e.g. "Mr. Mime", "Flabébé"), or the list name ("Mr Mime") while the species loads or if it fails.
  - The type chips show once that Pokémon has loaded.
  - The columns are not tappable.
- Below, on white: the six stats (HP, Attack, Defense, Special Attack, Special Defense, Speed), one row each.
  - Each row: the stat name centred on its own line, and under it the two mirrored bars meeting in the middle. The left Pokémon's bar grows from the middle to the left, the right one's from the middle to the right. The empty part of each bar is `track`.
  - The numbers are fixed at the outer edges: the left value at the far left, the right value at the far right, always in the same place, whatever the bar length.
  - Bar length = value / 150, never more than full (`getStatFraction`, the same scale as the detail screen).
  - Per stat, the higher value gets a `primary` bar and a bold number; the lower one a `textSecondary` bar and a regular number. A tie: both purple and bold.
  - Accessibility: each row is one element with a label like "Attack: Bulbasaur 49, Charmander 52".
- Loading: the stats wait for both Pokémon. Until then, one spinner in place of the stats.
- Errors: if one or both Pokémon fail to load, one `ErrorView` in place of the stats, "Could not load the comparison.", with "Try again" that refetches only the one(s) that failed. The header stays (artwork, names, numbers, and the type chips of the one that loaded). If only a species fails, the list name shows and the rest works.
- An id that is not a number (deep link): `ErrorView` "This Pokémon does not exist." without "Try again".
- Two forms or the same species are fine (e.g. Charizard vs Charizard Mega X).

## Acceptance Criteria

- [ ] The ⋮ menu on both tabs has "Compare", between the favorite item and Share.
- [ ] After "Compare", both tabs show the full-width purple banner "Pick a Pokémon to compare with {Name}" (e.g. "…with Bulbasaur") with a close button, and the first Pokémon's card is dimmed. Switching tabs and searching keeps it.
- [ ] Tapping a card on either tab opens the compare screen with both Pokémon; tapping the first Pokémon itself does nothing.
- [ ] "Open Pokémon" in the ⋮ menu while picking opens the detail without the banner; coming back, the banner is still there.
- [ ] The close button cancels pick mode. Android back cancels it too, but if you are searching, the first back leaves search and the second cancels pick mode. After that, cards open the detail again.
- [ ] The compare screen shows both artworks, names (official, like the detail header), numbers and type chips side by side, with "vs" in between. Artwork, names and numbers show at once.
- [ ] The six stats show as mirrored bars, each stat name centred above its bars, the values fixed at the outer edges; per stat the higher one is purple and bold, the lower grey, a tie both purple.
- [ ] A value above 150 (e.g. Blissey's HP, 255) fills its bar and does not overflow.
- [ ] While loading, one spinner shows in place of the stats; a failure shows one `ErrorView` with "Try again" there.
- [ ] Opening a Pokémon you have already seen shows its data without a spinner (cache).
- [ ] No hex codes in components; `AGENTS.md` lists the compare context and the new components.
- [ ] `npx expo lint` and `npx tsc --noEmit` without errors.

## Out of Scope

- A total row (sum of all stats).
- Animations on the compare screen.
- Comparing more than two Pokémon, or swapping the two sides.
- Starting a comparison from the detail screen.
- Opening a Pokémon's detail from the compare screen.
- Comparing height, weight, abilities or the evolution chain.
- Keeping pick mode after closing the app.
- Tests and a test runner for `src/utils/compare.ts`: a separate testing issue.
