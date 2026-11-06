import { createContext, type ReactNode, use, useMemo, useState } from 'react';

export type ComparePokemon = { id: number; name: string };

type ComparePickValue = {
  /** The first Pokémon of a comparison while picking the second; `null` when not picking. */
  first: ComparePokemon | null;
  /** Starts pick mode, or replaces the first Pokémon if already picking. */
  start: (pokemon: ComparePokemon) => void;
  cancel: () => void;
};

const ComparePickContext = createContext<ComparePickValue | null>(null);

/**
 * App-wide pick mode for Compare, shared by both tabs. In memory only:
 * closing the app ends it. Rendered once in `src/app/_layout.tsx`.
 */
export function ComparePickProvider({ children }: { children: ReactNode }) {
  const [first, setFirst] = useState<ComparePokemon | null>(null);
  const value = useMemo<ComparePickValue>(
    () => ({ first, start: setFirst, cancel: () => setFirst(null) }),
    [first],
  );
  return <ComparePickContext value={value}>{children}</ComparePickContext>;
}

export function useComparePick(): ComparePickValue {
  const value = use(ComparePickContext);
  if (!value) {
    throw new Error('useComparePick must be used inside ComparePickProvider');
  }
  return value;
}
