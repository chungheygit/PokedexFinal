Route: Pokédex. Tools: Claude Code.

1. Technical choices

Stored in SQLite (favorites):

The only thing the user creates in the app is the list of favorites, so that is the only data I store. The table is created in src/services/database.ts:6 and the database is opened only once (line 13). A favorite is added with INSERT OR REPLACE (src/services/favorites.ts:47), so a Pokémon can never be in the list twice, and the list is sorted by the date it was added (favorites.ts:37). 

An alternative was to store the whole Pokémon (types and stats) in SQLite as well. That data already comes from the API and TanStack Query caches it, so a stored copy would only go out of date.

While building, created_at changed from a text timestamp to a number in milliseconds, because two favorites added in the same second had no fixed order. I also removed the separate query that checks if a Pokémon is a favorite. Everything now reads one list (src/hooks/use-favorites.ts:33), so the heart, the menu and the tab always agree.


Native feature (share feature):

Share is in three dot menu on every card (src/components/pokemon-options-menu.tsx:18). The text comes from getShareText in src/utils/pokemon.ts:66. I chose Share because the options menu in the Figma already has it. My first spec also had Share on the detail screen, but the Figma detail screen has no share button, so I removed it.


Search feature:

PokeAPI has no search endpoint, so the app loads all the names once, with the same request as the list, and filters them on the phone (src/hooks/use-pokemon-search.ts:13). The matching is in src/utils/search.ts:9. It makes the text lowercase, removes accents and keeps only letters and digits, so "Mr. Mime" and "flabébé" are found as well. I added this during the grilling. At first I only planned to ignore case.


Design:

All colours, the type colours and the Rubik fonts are in one file, src/constants/theme.ts (palette at line 11, type colours at line 36 and fonts at line 80), so no screen has its own hex codes. The Pokéball tab icon was first planned as an icon from Material Symbols, but it didn't show up and after asking the agent it found that this icon is missing from the font Expo uses. So I exported it from the Figma as a PNG instead (src/components/app-tabs.tsx:22). I did the same for the filled heart.


2. Pick one feature and explain how it works, from API call to screen.

The pokemon list:
The API call is `fetchPokemonList` in `src/services/pokemon-api.ts:58`. It gets every Pokémon's name and URL from PokeAPI in one request. If PokeAPI answers with an error, it throws (line 51).

The hook `usePokemonList` in `src/hooks/use-pokemon-list.ts` calls it through TanStack Query (key `['pokemon', 'list']`, line 18). TanStack keeps the result in its cache, so going to another tab and back does not load it again. The hook also takes the id out of each URL (line 20).

The home screen `src/app/(tabs)/index.tsx` uses that list (through `usePokemonSearch`, line 31, which filters the same list when you search). While it loads, it shows a spinner (line 109). If it fails, it shows `ErrorView` with "Try again" (line 105). When the data is there, it shows `PokemonGrid` (line 94): two columns of `PokemonCard`s with the sprite, number and name.

3. Name a suggestion from the agent that you rejected or changed.

In issue #1, the tab label "Pokémons" looked bolder than the Rubik font. The agent found that the native tab bar of Android makes the selected label bold, and it recommended switching to JavaScript tabs so the label would really be Rubik. I said no and kept the native tabs. It is only one small label, the switch would cost time and maybe the purple pill behind the icon would have to be redrawn, and the native tabs feel like a real Android app. I wrote it down as a known difference in specs/features/list.md (Out of Scope). Chat: chat-history/issue-1.md.

In issue #3, the agent wanted to add an icon font package for the filled heart. My spec now said no new dependencies, so I exported the filled heart from the Figma as a PNG instead (assets/images/heart-filled.png). Chat: chat-history/issue-3.md.