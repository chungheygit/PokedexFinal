# Pokémon list

## Goal

See all Pokémon in a grid, so I can browse them and open the one I want.

## Constraints

- Home screen `src/app/(tabs)/index.tsx`, replaces the placeholder. Layout as in `specs/design/home.png` (grid) and `specs/design/options.png` (⋮ menu).
- No new dependencies except expo-font. No FlashList, no bottom-sheet library.

### Data

- `https://pokeapi.co/api/v2/pokemon?limit=100000`, one request in a service in `src/services/`, through a TanStack Query hook in `src/hooks/`.
- Query key `['pokemon', 'list']`, so search can reuse the same cache. `staleTime: Infinity`, `retry: 1`.
- The id is the last number in each `url`. Sprite by id: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png`.
- Forms (ids 10001 and up) are part of the list, as the API gives them.

### Helpers (`src/utils/`, pure functions)

- Id from url.
- Number: the id padded to at least 3 digits, no `#` (`001`, `025`, `1025`, `10034`), as on the badge in the Figma.
- Name: hyphens become spaces, every word gets a capital letter (`mr-mime` → `Mr Mime`, `charizard-mega-x` → `Charizard Mega X`). Search, favorites and share use the same helper.
- Share text: `Check out {Name} (#{Number})!`. The share text keeps the `#`.

### Design system (set up here, reused by every later feature)

- Colours in `src/constants/theme.ts`, replacing the old course colours. Measured from `specs/design/`:

  | Token | Hex | Used for |
  | --- | --- | --- |
  | `background` | `#ECF6FF` | page background |
  | `cardTop` | `#F6F6FF` | card top, behind the sprite |
  | `card` | `#FFFFFF` | card bottom, behind the name; the ⋮ menu |
  | `primary` | `#5126F5` | number badge, "Try again" button, active tab |
  | `onPrimary` | `#FFFFFF` | text on purple |
  | `text` | `#111532` | titles, names, menu items |
  | `textSecondary` | `#84838B` | secondary text, inactive tab |

  `ErrorView` switches to `primary` / `onPrimary`, so its button turns purple. Dark mode is not part of this issue: the dark palette gets the same values for now. The template components that are left alone may still need their old token names to compile. `tsc` must pass.
- Rubik with expo-font from `assets/fonts/`, loaded in the root layout. The splash screen stays up until the fonts are loaded. Bold for the screen title, SemiBold for the card names, Medium for the number badge, Regular for everything else. The font names live in `theme.ts` and replace the current system `Fonts`.
- Add a line to `AGENTS.md` for every shared piece this issue sets up: the API service, the fonts, `PokemonCard`, the options menu, the formatting helpers.

### Tabs

- Only the Pokémons tab. The label changes from "Items" to "Pokémons". Favorites gets its tab in the favorites feature.
- Icon: the Pokéball PNG exported from the Figma, `assets/images/tabIcons/pokeball.png` (with `@2x` and `@3x`), as `src` on both platforms; the tab colours tint it. Not `md="catching_pokemon"`: the Material Symbols font that expo-symbols bundles has no `catching_pokemon` glyph, so it draws a missing-glyph box.

### Pokémon card (`src/components/`, reusable)

- Props: `{ id, name }`, `onPress`, `onOptionsPress`. Nothing else, so favorites (from SQLite: `id`, `name`) and search can use it unchanged.
- Fills the width of its parent. The image part is square (as high as the card is wide), the name strip below it is 48 high. In the Figma (390-wide screen) a card is 163×211. `getPokemonCardHeight(width)` gives the height, so the list can use `getItemLayout`. Memoized. Sprite with expo-image.
- If the sprite fails to load (some forms have none), the card shows the Pokéball PNG tinted `textSecondary`, never a broken image.
- The name is one line, cut off with an ellipsis ("Charmanderd…").

### Grid

- 24 (`Spacing.four`) from the screen edge to the cards and the title, 16 (`Spacing.three`) between cards and between rows.
- Card width comes from the screen width: `(width - 2 × 24 - 16) / 2`, so 163 on a 390-wide screen. `getItemLayout` uses that row height.
- Each card sits in a cell that is always half the row. The last row has a single card (1351 Pokémon), and that card stays half width, not stretched.

### Options menu (`src/components/`, reusable)

- A React Native `Modal`, as in `options.png` (Android): a sheet sliding up from the bottom over a dimmed backdrop. No Cancel button.
- Rendered once by the screen, not by each card. The items are passed in as a prop, so favorites can add "Add to favorites" / "Remove from favorites" later.
- Closes when you tap the backdrop, press the Android back button, or pick an item.

### Detail route stub

- `src/app/pokemon/[id].tsx` only shows the id, so the tap can be tested. The detail feature replaces it.

## Acceptance Criteria

- [ ] Tab "Pokémons" with the Pokéball icon on Android.
- [ ] Title "All Pokémon" with a grid of 2 columns of cards below it. The title is the list header and scrolls along with the grid.
- [ ] Every card shows the sprite, a purple number badge (`001`, at least 3 digits, no `#`), the name with capital letters (`Bulbasaur`, `Mr Mime`) and a ⋮ button.
- [ ] Cards have a square image part and a 48 name strip (163×211 on a 390-wide screen). 24 to the screen edge, 16 between cards and rows.
- [ ] The single card in the last row is as wide as the others.
- [ ] Long names are cut off with an ellipsis on one line.
- [ ] A form without a sprite shows the grey Pokéball placeholder, not a broken image.
- [ ] All ~1300 Pokémon, live from the API, in a `FlatList` with `numColumns={2}`. Flinging from top to bottom in Expo Go on Android never shows a blank screen for more than about a second.
- [ ] Tapping a card goes to `/pokemon/{id}` (the stub shows the id).
- [ ] Tapping ⋮ opens the menu and does not also open the card.
- [ ] The menu has "Open Pokémon" and "Share", no Cancel. "Open Pokémon" goes to `/pokemon/{id}`. Share opens the phone's share sheet with "Check out Pikachu (#025)!". Tapping the backdrop or pressing back closes the menu.
- [ ] A spinner while loading. An error with a purple "Try again" when it fails, shown after one retry, not three. If a background refetch fails while the list is on screen, the list stays.
- [ ] Rubik everywhere: Bold title, SemiBold names, Medium badge. The colours match the table above, with no hex codes in components.
- [ ] Accessibility: ⋮ has the label "Options for Bulbasaur" and a hitSlop. The card has the label "Bulbasaur, number 1".
- [ ] `AGENTS.md` lists the new shared pieces.
- [ ] `npx expo lint` and `npx tsc --noEmit` without errors.

## Out of Scope

- The search bar (search feature), the detail screen itself (detail feature), the Favorites tab (favorites feature).
- "Add to favorites" in the ⋮ menu (favorites feature).
- Sorting, filtering, pagination.
- Dark mode colours.
- Removing the template leftovers (`animated-icon`, `hint-row`, `web-badge`, `external-link`, `collapsible`, `Brand`, `global.css`).
- The tab label font, a known difference from the Figma: on Android the native tab bar (Material, via react-native-screens) bolds the selected tab's label, so "Pokémons" looks bolder than Rubik Regular. Turning that off needs a native style change and a development build, so it can't be done in Expo Go. We keep native tabs.
