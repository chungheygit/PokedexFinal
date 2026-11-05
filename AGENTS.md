# Pokédex

A Pokédex app on PokeAPI (https://pokeapi.co/api/v2, public, no key), following the Figma design. Must run in Expo Go.

- Expo Router, TanStack Query, expo-sqlite, TypeScript. No libraries that need a development build.
- Screens in `src/app/`, data through hooks in `src/hooks/`, API and SQL in `src/services/`, reusable UI in `src/components/`. A screen renders, a hook gets data, a service talks to the API or the database. Nothing does two of those.
- Shared setup (API client, query client, database): reuse what is listed here, never add a second one. When you set up something new that other features will use, add a line here: what it is and where it lives.
  - Query client: `QueryClientProvider` in `src/app/_layout.tsx`.
  - Theme: colours, spacing and radius in `src/constants/theme.ts`. Never a hex code in a component.
  - Error state: `src/components/error-view.tsx`.
- Before you write code for an issue: post a plan (which files, how, what you are unsure about) and a `- [ ]` task list as one comment on the issue with `gh issue comment`. Wait for my go. Tick off tasks with `gh issue comment --edit-last` while you build.