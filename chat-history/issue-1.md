# Issue #1: Pokémon list (chat history)

Exported from the Claude Code desktop app (session transcript, converted to Markdown). Tool calls are summarised in one line each; tool output is left out.


## 👤 You

Implement issue https://github.com/chungheygit/PokedexFinal/issues/1 Follow agents.md


## 🤖 Agent

> 🔧 `Bash`: Read issue 1 and list spec files

> 🔧 `Bash`: Read issue, list spec, package.json, project tree

> 🔧 `Bash`: Retry reading the issue and check gh auth

> 🔧 `Bash`: Read issue 1 as JSON

> 🔧 `Bash`: Read current layouts, components and theme

Reading the designs and the remaining components, then I'll post the plan on the issue.

> 🔧 `Read`: D:\ADD_Frontend\Exam\PokedexFinal\specs\design\home.png

> 🔧 `Read`: D:\ADD_Frontend\Exam\PokedexFinal\specs\design\options.png

> 🔧 `Bash`: Read hooks, splash overlay, and find token usages

> 🔧 `Write`: C:\Users\chung\AppData\Local\Temp\claude\d91a40cb8f79d6f3\54c7a286-8aa5-4f1c-ad9b-894528bb68a7\scratchpad\issue1-plan.md

> 🔧 `Bash`: Post the plan and task list on issue 1

I read issue 1 and its spec (`specs/features/list.md`), and posted the plan with a 12-task checklist as a comment on the issue: [issue comment](https://github.com/chungheygit/PokedexFinal/issues/1#issuecomment-6681121261). AGENTS.md says to wait for your go, so I haven't changed any code yet.

**What it builds:**
- **Design system:** the new colours and the Rubik font names go in `theme.ts`, and the root layout loads the fonts while the splash screen stays up.
- **Data:** one service, `fetchPokemonList`, and one hook, `usePokemonList`, using query key `['pokemon','list']`, `staleTime: Infinity` and `retry: 1`. The helpers (id, number, name, share text) go in `src/utils/pokemon.ts`.
- **Screens and components:** a reusable `PokemonCard` and `OptionsMenu`, the 2-column grid on the home screen, the `pokemon/[id]` stub, and the "Pokémons" tab with the Pokéball icon.

**Things you may want to decide first:**
1. **Scroll positions:** `getItemLayout` with 2 columns and a header means the header needs a fixed height too, or the scroll position jumps.
2. **Menu animation:** a plain `Modal` with `animationType="slide"` also slides the dimmed backdrop up with the sheet. I plan to fade the backdrop and slide only the sheet, using Reanimated, which is already installed. If you'd rather keep it simple, the "Use plain slide" button picks the plain slide.
3. **Splash overlay:** the template's splash overlay hides the splash screen as soon as it appears. I'll keep it but only show it once the fonts are loaded, since removing the template leftovers is out of scope.
4. **Dark mode:** the dark colours are the same as the light ones for now, as the spec says.


## 👤 You

All four are fine. 2: go with Reanimated, not the plain slide. Go.


## 🤖 Agent

> 🔧 `ToolSearch`: select:WebFetch

> 🔧 `WebFetch`: https://docs.expo.dev/versions/v58.0.0/sdk/font/

> 🔧 `WebFetch`: https://docs.expo.dev/versions/v58.0.0/sdk/symbols/

> 🔧 `WebFetch`: https://docs.expo.dev/versions/v58.0.0/sdk/router-native-tabs/

> 🔧 `Bash`: Inspect NativeTabs type definitions

> 🔧 `Bash`: Read NativeTabs icon and colour prop types

> 🔧 `Bash`: Check md icon prop and SymbolView name types

Docs checked; writing the theme and root layout next.

> 🔧 `Bash`: Check Material Symbol names exist in types

> 🔧 `Bash`: Find the AndroidSymbol type definition

> 🔧 `Bash`: Confirm needed Material Symbol names exist

> 🔧 `Write`: D:\ADD_Frontend\Exam\PokedexFinal\src\constants\theme.ts

> 🔧 `Write`: D:\ADD_Frontend\Exam\PokedexFinal\src\app\_layout.tsx

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\src\components\themed-text.tsx

> 🔧 `Write`: D:\ADD_Frontend\Exam\PokedexFinal\src\components\error-view.tsx

> 🔧 `Bash`: Tick the first three tasks on the issue comment

> 🔧 `Write`: D:\ADD_Frontend\Exam\PokedexFinal\src\utils\pokemon.ts

> 🔧 `Write`: D:\ADD_Frontend\Exam\PokedexFinal\src\services\pokemon-api.ts

> 🔧 `Write`: D:\ADD_Frontend\Exam\PokedexFinal\src\hooks\use-pokemon-list.ts

Data layer is done (helpers, service, hook). Now writing the card and the options menu.

> 🔧 `Bash`: Check Modal props and SF symbol names

> 🔧 `Bash`: Locate Modal types and SF symbol list

> 🔧 `Write`: D:\ADD_Frontend\Exam\PokedexFinal\src\components\pokemon-card.tsx

> 🔧 `Write`: D:\ADD_Frontend\Exam\PokedexFinal\src\components\options-menu.tsx

> 🔧 `Bash`: Check whether typed route types exist

> 🔧 `Write`: D:\ADD_Frontend\Exam\PokedexFinal\src\app\(tabs)\index.tsx

> 🔧 `Write`: D:\ADD_Frontend\Exam\PokedexFinal\src\app\pokemon\[id].tsx

> 🔧 `Write`: D:\ADD_Frontend\Exam\PokedexFinal\src\components\app-tabs.tsx

> 🔧 `Bash`: Run TypeScript typecheck

Only error left is the stale typed-routes file; starting the dev server briefly to regenerate it.

> 🔧 `Bash`: Start Expo briefly to regenerate typed routes

> 🔧 `Bash`: Inspect the generated router types

Regenerated (template-literal form, so my grep missed it). Re-running typecheck and lint.

> 🔧 `Bash`: Run typecheck and lint

> 🔧 `Bash`: Run ESLint via Expo

Typecheck and lint pass. Quick sanity run of the helpers, and a check that the API and sprite URLs behave as assumed:

> 🔧 `Bash`: Run helpers and probe API and sprite URLs

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\AGENTS.md

> 🔧 `Bash`: Tick all tasks on the issue and show changed files

The Pokémon list from issue 1 is built. `npx tsc --noEmit` and `npx expo lint` pass with no errors, and all 12 tasks are ticked on the [issue comment](https://github.com/chungheygit/PokedexFinal/issues/1#issuecomment-6681121261). I haven't run it in Expo Go on a phone yet, and nothing is committed.

**What's built:**
- **Design system:** the 7 colours and a `backdrop` colour for the menu are in [theme.ts](src/constants/theme.ts). The dark palette uses the same values for now. Rubik is loaded in [_layout.tsx](src/app/_layout.tsx) and the splash screen stays up until it has loaded. The "Try again" button in `ErrorView` is now purple.
- **Data:** [pokemon-api.ts](src/services/pokemon-api.ts) makes the one request, and [use-pokemon-list.ts](src/hooks/use-pokemon-list.ts) wraps it with key `['pokemon','list']`, `staleTime: Infinity` and `retry: 1`. The helpers are in [utils/pokemon.ts](src/utils/pokemon.ts).
- **UI:**
  - [pokemon-card.tsx](src/components/pokemon-card.tsx): a fixed-height card. The card and the ⋮ button are two separate buttons, so tapping ⋮ never also opens the card. If a sprite fails to load, the card shows a placeholder icon.
  - [options-menu.tsx](src/components/options-menu.tsx): a `Modal` whose backdrop fades in while the sheet slides up with Reanimated. It closes on a backdrop tap, the Android back button, or picking an item.
  - [index.tsx](src/app/(tabs)/index.tsx): the 2-column `FlatList`, with "All Pokémon" as its header. If a background refetch fails, the list stays on screen.
  - The `pokemon/[id]` stub, and the "Pokémons" tab with the Pokéball icon.
- **AGENTS.md:** lines for the API service, the list hook, the fonts, the card, the menu and the helpers.

**Checked outside the app:**
- The helpers give `#001`, `#10034`, `Mr Mime` and "Check out Pikachu (#025)!".
- The API returns 1,351 entries.

**Not tested on a phone:**
- Flinging the list from top to bottom on Android.
- The Share sheet. On iOS it opens while the menu is still closing, which may need a small delay.
- Reanimated's slide-up inside the `Modal`.

To try it:

```bash
npx expo start
```


## 👤 You

Change:

* Dont show '#' before the number
* At the bottom of the list, the last card (#10326) stretches across the full width, because there are 1351 Pokémon, so the last row has only one card. It should stay half width, like all the other cards


## 🤖 Agent

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\src\utils\pokemon.ts

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\src\utils\pokemon.ts

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\src\components\pokemon-card.tsx

Now the grid: each card gets a 50%-wide cell with half the gap as padding on each side, so a lone last card stays half width.

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\src\app\(tabs)\index.tsx

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\src\app\(tabs)\index.tsx

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\src\app\(tabs)\index.tsx

> 🔧 `Bash`: Typecheck, lint and run the number helpers

Both changes are in, and `tsc` and lint pass. I haven't looked at the grid in Expo Go yet.

- **No `#` on the badge:** `formatNumber` in [pokemon.ts](src/utils/pokemon.ts) now returns `001`, `025` and `10326`, which matches the Figma. I kept the `#` in the share text ("Check out Pikachu (#025)!"), because the acceptance criteria ask for that exact text. Say if you want it gone there too. The spec and the issue still say `#001` for the badge, so you may want to update them.
- **Last card:** each card in the grid now sits in a cell that is always 50% wide, with half the gap as padding on each side, in [index.tsx](src/app/(tabs)/index.tsx). A row with only one card no longer stretches it across the screen. The outer margins and the 16px gap between cards stay the same. The card itself now fills whatever width its parent gives it, instead of using `flex: 1`. That also makes it easier for search and favorites to reuse it.


## 👤 You

1. The cards are too short. In the Figma (390-wide screen) a card is 163×211: the image part is square (163×163) and the name strip is 48. Make the top part square, as high as the card is wide. Keep getItemLayout working.
2. The screen edge should be 24 (Spacing.four), not 16. The gap between cards and between rows (16) is right.


## 🤖 Agent

> 🔧 `Read`: D:\ADD_Frontend\Exam\PokedexFinal\src\components\pokemon-card.tsx

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\src\components\pokemon-card.tsx

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\src\components\pokemon-card.tsx

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\src\components\pokemon-card.tsx

Card done. Now the grid: card width from the screen width, so the row height is known for `getItemLayout`.

> 🔧 `Read`: D:\ADD_Frontend\Exam\PokedexFinal\src\app\(tabs)\index.tsx

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\src\app\(tabs)\index.tsx

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\src\app\(tabs)\index.tsx

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\src\app\(tabs)\index.tsx

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\AGENTS.md

> 🔧 `Bash`: Typecheck, lint, and check for stale references

Both changes are in, and `tsc` and lint pass. I haven't checked the grid or fast scrolling in Expo Go yet.

1. **Square cards:** in [pokemon-card.tsx](src/components/pokemon-card.tsx) the image part is now square and as high as the card is wide, with the 48 name strip below it. The sprite takes 75% of that square, a guess at the Figma size. I replaced the fixed `POKEMON_CARD_HEIGHT` with `getPokemonCardHeight(width)`, which returns width + 48. I updated the card line in AGENTS.md to match.
2. **Edge of 24:** in [index.tsx](src/app/(tabs)/index.tsx) the screen edge is now `Spacing.four`, and the gap between cards and between rows stays 16. The title lines up at 24 too.

**`getItemLayout`:** a card's height now depends on the screen width, so the grid works it out the same way the layout does. On a 390-wide screen that gives 163, so a card is 211 high and a row is 227 including the gap. `getItemLayout` uses that row height. Each cell is also set to exactly that height, so the real layout can't drift from what `getItemLayout` expects over the 676 rows.


## 👤 You

The Pokéball icon on the Pokémons tab doesn’t load on Android: I see a standing rectangle with a cross (a broken image) instead. The code uses md="catching_pokemon". Find out why it doesn’t load in Expo Go and fix it. If md can’t work in Expo Go, suggest an alternative and ask me first.


## 🤖 Agent

> 🔧 `Grep`: D:\ADD_Frontend\Exam\PokedexFinal\node_modules\expo-router\build\native-tabs

> 🔧 `Bash`: Read the Android icon converters and symbol source loader

> 🔧 `Bash`: Read the symbol font source and promise-icon handling

> 🔧 `Bash`: Inspect symbol font asset and expo-font render API

> 🔧 `Bash`: Read weight font module and native render implementation

> 🔧 `Bash`: Read native render code and look for Expo Go font scoping

> 🔧 `Bash`: Look for font-name scoping in expo-font

> 🔧 `Bash`: Check Material Symbols font package and codepoint

Codepoint for `catching_pokemon` is U+E508. Checking whether the bundled Material Symbols font actually contains that glyph:

> 🔧 `Bash`: List font files and check for fontTools

> 🔧 `Bash`: Check the font's cmap for the icon codepoints

> 🔧 `Bash`: Search the font for any Pokéball glyph name

> 🔧 `Bash`: Check latest Material Symbols font package version

> 🔧 `Bash`: Check @expo/vector-icons has a pokeball glyph

`md` itself works in Expo Go, but the `catching_pokemon` icon doesn't exist in the font it draws from. A dev build would show the same broken box, so moving off Expo Go won't fix it. I haven't changed anything yet.

**Why it breaks:**
1. On Android, `md="catching_pokemon"` makes `expo-symbols` load its Material Symbols font (from `@expo-google-fonts/material-symbols`, version 0.4.53, the latest). It then draws the icon into a PNG with `expo-font`.
2. `expo-symbols` maps `catching_pokemon` to character U+E508. I checked the font file: U+E508 isn't in it, and nothing in the font is named `catching_pokemon` either.
3. With no icon to draw, Android draws the font's "missing character" box, which is the standing rectangle with a cross.

The other icons I use come from the same font and are all there: `share`, `open_in_full` and `more_vert`, so the menu and ⋮ icons are fine. But the card's placeholder for a missing sprite also uses `catching_pokemon`, so it shows the same broken box.

**Two options:**
- **Our own Pokéball PNG (my recommendation).** Add `assets/images/tabIcons/pokeball.png` in 1x, 2x and 3x, and use it as the tab's `src`. Android tints it with the tab colours. The card placeholder would show the same image, tinted grey with expo-image's `tintColor`. This needs no new dependency, and it works the same on iOS. If you can export the icon from the Figma it will match the design exactly. Otherwise I'll draw a simple Pokéball with a script.
- **Add `@expo/vector-icons`.** Its MaterialCommunityIcons set has a `pokeball` icon, which would go in the tab through `NativeTabs.Trigger.VectorIcon`. It works in Expo Go, but it's a new dependency, and the spec allows none besides expo-font.


## 👤 You

I exported the Pokéball from the Figma: assets/images/tabIcons/pokeball.png, @2x and @3x. Use it for the tab icon and for the card placeholder (tinted grey).


## 🤖 Agent

> 🔧 `Bash`: Check the Pokéball PNG files and their sizes

> 🔧 `Read`: D:\ADD_Frontend\Exam\PokedexFinal\assets\images\tabIcons\pokeball@3x.png

The export looks right: 24/48/72 px with a transparent background, so it can be tinted. Wiring it in.

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\src\components\app-tabs.tsx

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\src\components\pokemon-card.tsx

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\src\components\pokemon-card.tsx

> 🔧 `Bash`: Typecheck, lint, and check no catching_pokemon remains

> 🔧 `Bash`: Show working tree status and recent commits

The Pokéball PNG you exported is now the tab icon and the card placeholder. `tsc` and lint pass. I haven't looked at either in Expo Go yet.

- **Tab icon:** in [app-tabs.tsx](src/components/app-tabs.tsx) I dropped `md` and use `pokeball.png` as the `src` on both platforms. The tab colours tint it: purple when active, grey when not. A comment explains why `md` isn't used.
- **Card placeholder:** in [pokemon-card.tsx](src/components/pokemon-card.tsx), a card without a sprite now shows the same PNG at 48 in `textSecondary` grey, using expo-image's `tintColor`. Nothing uses `catching_pokemon` any more.

**Things to know:**
- **Placeholder sharpness:** the largest export is 72 px. At 48 on a 3× screen that gets stretched to 144 px, so the placeholder may look a bit soft. A larger export, such as a 144 px `@3x`, would make it sharp.
- **Spec out of date:** `specs/features/list.md` still says `md="catching_pokemon"` for the tab icon, so you may want to change that line.


## 👤 You

The label on the Pokémons tab doesn’t look like Rubik: it looks like a different, bolder font than the rest of the app. Check whether the native tab bar can use the Rubik font loaded with useFonts in Expo Go. If it can’t, tell me the options and ask me before changing anything.


## 🤖 Agent

> 🔧 `Grep`: D:\ADD_Frontend\Exam\PokedexFinal\node_modules\expo-router\build\native-tabs

> 🔧 `Bash`: Read Android tab appearance and native font handling

> 🔧 `Bash`: Read native font application and labelStyle conversion

> 🔧 `Bash`: Check how expo-font registers fonts on Android

> 🔧 `Bash`: Find when the tab font is applied; check for adb

> 🔧 `Bash`: Check connected devices and the appearance update flow

No phone or emulator is connected over adb, so I can't look at the label directly. I'm checking Material's tab item code for anything that changes the typeface after react-native-screens sets it.

> 🔧 `Bash`: Find Material version and any text appearance overrides

> 🔧 `WebFetch`: https://raw.githubusercontent.com/material-components/material-components-android/1.13.0/lib/java/com/google/android/material/navigation/NavigationBarItemView.j

> 🔧 `Bash`: Check which tab alternatives ship with expo-router

Expo Go can give the native tab bar the Rubik loaded with `useFonts`. What makes the label bolder is most likely Android's own tab bar, not Expo Go. I couldn't confirm this on a device: no phone or emulator is connected over adb. I haven't changed anything.

**What the code shows:**
- **The font name is found.** `useFonts` registers Rubik-Regular in React Native's font manager, and react-native-screens looks the tab label's font up in that same manager. That's also how your other text gets Rubik, so the name resolves in Expo Go.
- **The tab bar then makes the label bold.** react-native-screens draws the tabs with Android's Material component (version 1.13.0). By default it makes the selected tab's label bold. With only one tab, "Pokémons" is always selected, so it's always bold. If Material applies its own style after the font is set, you get a bold system font instead of Rubik. Either way, it's bolder than the rest of the app.
- **There's no setting for it.** react-native-screens doesn't expose the bold option, and it uses the `fontFamily` you pass for the selected tab only for the size. Turning the bold off means changing the native Android style, which needs a development build, not Expo Go.

**Options:**
1. **Switch to JavaScript tabs (my recommendation).** Use `Tabs` from `expo-router/tabs`, which ships with expo-router, so there's no new dependency. The label is a normal React Native text, so it's guaranteed Rubik Regular with exactly the colours you choose. The same Pokéball PNG goes in as the icon. The trade-offs:
   - You lose the native Material look.
   - The purple pill behind the active icon would have to be drawn by hand to match the Figma.
   - Only `app-tabs.tsx` and `(tabs)/_layout.tsx` change.
2. **Keep the native tabs.** Accept the bolder label for now. Making it Rubik later needs a config plugin or a patch to the Android style, and a development build. Expo Go would keep showing it bold.

If you want, I can try to confirm the cause on a device first: connect your Android phone with USB debugging or start an emulator, and I'll take a screenshot.


## 👤 You

Keep native tabs


## 🤖 Agent

> 🔧 `Write`: C:\Users\chung\.claude\projects\D--ADD-Frontend-Exam-PokedexFinal\memory\native-tabs-label-font.md

> 🔧 `Bash`: Add the memory to the index

Native tabs stay as they are, and I haven't changed any code. I saved the decision in my notes for this project, so I won't raise the bolder Android tab label as a bug or suggest switching tab bars again.

The list feature is still uncommitted.


## 👤 You

I see you use if / else if / else instead of a   '' ? : '' chain, any benefits or differences in using that?


## 🤖 Agent

There's no difference in behaviour or speed. Both build the same element, and React can't tell which one you wrote. The reason is readability, and it's specific to having three branches here.

The home screen ([index.tsx](src/app/(tabs)/index.tsx)) shows one of three things: the list, the error or the spinner. As a ternary that's a nested chain:

```tsx
{data ? (
  <FlatList … 15 props … />
) : isError ? (
  <ErrorView … />
) : (
  <View style={styles.center}>
    <ActivityIndicator … />
  </View>
)}
```

**Why I picked `if / else if / else`:**
- **Easier to read.** Each condition sits next to what it shows. In a nested ternary the `: isError ? (` lands after a long `FlatList`, and it's easy to lose track of which `:` belongs to which `?`. Many style guides ban nested ternaries for that reason. ESLint has a `no-nested-ternary` rule for it, though the Expo config doesn't turn it on.
- **Easier to change.** A fourth state, such as an empty list, is one more `else if`, not another level of nesting.
- **The order is visible.** The order matters here: `data` comes before `isError`, so a failed background refetch keeps the list on screen. As separate branches, that order reads like a list of rules.

**When a ternary is better:** for two branches with short results, like `pressed ? 0.6 : 1` or `spriteFailed ? <Placeholder /> : <Image />` in the card. That's why I used one there.

**The trade-off:** `let content;` with no type relies on TypeScript working out the type from each assignment. While it's unassigned it's briefly `any`, which you could argue goes against the "Clean TypeScript: no `any`" goal in the product spec. Writing `let content: ReactNode;` would make it explicit.

**Other ways to write it:**
- **Early `return`s.** This is the most common pattern, but the screen would repeat the `SafeAreaView` wrapper three times, because the wrapper and the `OptionsMenu` are shared.
- **A small component**, such as `<PokemonGrid />`, that does the early returns inside it. That's the cleanest option if the screen grows.

I can add the `ReactNode` type or split out that component if you want.


## 👤 You

Update list.md so it matches what we built: the Pokéball PNG instead of md, the square cards (163×211 in the Figma), 24 to the screen edge and 16 between cards, the last card staying half width, and the tab label font in Out of Scope as a known difference. Then add these lessons to AGENTS.md: compare sizes and spacing with specs/design/ before saying done; check that an md icon exists before using it, otherwise use a PNG; a lone card in the last row keeps the same width. Also add the Pokéball icon under shared setup


## 🤖 Agent

> 🔧 `Read`: D:\ADD_Frontend\Exam\PokedexFinal\specs\features\list.md

> 🔧 `Read`: D:\ADD_Frontend\Exam\PokedexFinal\AGENTS.md

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\specs\features\list.md

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\specs\features\list.md

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\specs\features\list.md

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\specs\features\list.md

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\specs\features\list.md

> 🔧 `Edit`: D:\ADD_Frontend\Exam\PokedexFinal\AGENTS.md

I updated both files. Nothing is committed yet.

**[list.md](specs/features/list.md)**
- **Tab icon:** it's now the Figma Pokéball PNG, used as `src` on both platforms. The spec says why `md="catching_pokemon"` doesn't work: that icon is missing from the font.
- **Card:** the image part is square and the name strip is 48 high, so 163×211 in the Figma. `getPokemonCardHeight(width)` gives the height for `getItemLayout`. The placeholder is the grey Pokéball.
- **New "Grid" section:**
  - 24 to the screen edge, 16 between cards and rows.
  - The card width is worked out from the screen width.
  - Each cell is half the row, so the lone last card stays half width.
- **Acceptance criteria:** two new items for the sizes and spacing and for the last card. The placeholder item now names the grey Pokéball.
- **Out of Scope:** the bolder tab label is listed as a known difference from the Figma. It says why it can't be fixed in Expo Go and that we keep native tabs.
- **Badge number (not on your list):** the spec still said `#001`, so to match the build I changed it to `001` with no `#`. The share text keeps the `#`: "Check out Pikachu (#025)!".

**[AGENTS.md](AGENTS.md)**
- Under shared setup there's a line for the Pokéball icon: its path, and that it's used for the tab and the tinted card placeholder.
- A new "Lessons from earlier issues" list with your three points:
  - Compare sizes and spacing with `specs/design/` before saying done.
  - Check that an `md` icon's glyph is really in the font, or use a PNG from the Figma.
  - Give grid cells a fixed share of the row, such as `width: '50%'`, so a lone last card keeps the same width.
