import type { StatRow } from '@/utils/pokemon-detail';

/** How one side's stat compares with the other side's. */
export type StatResult = 'higher' | 'lower' | 'tie';

export type CompareRow = {
  key: string;
  label: string;
  left: number;
  right: number;
  leftResult: StatResult;
  rightResult: StatResult;
};

/** `compareStat(52, 49)` → `'higher'`; equal values are a `'tie'`. */
export function compareStat(value: number, other: number): StatResult {
  if (value > other) {
    return 'higher';
  }
  if (value < other) {
    return 'lower';
  }
  return 'tie';
}

/**
 * One row per stat of the left Pokémon, in its order (the six stats from
 * `getStatRows`), with the right Pokémon's value for the same stat. A stat
 * the right side lacks counts as 0.
 */
export function getCompareRows(leftStats: StatRow[], rightStats: StatRow[]): CompareRow[] {
  return leftStats.map((stat) => {
    const right = rightStats.find((other) => other.key === stat.key)?.value ?? 0;
    return {
      key: stat.key,
      label: stat.label,
      left: stat.value,
      right,
      leftResult: compareStat(stat.value, right),
      rightResult: compareStat(right, stat.value),
    };
  });
}
