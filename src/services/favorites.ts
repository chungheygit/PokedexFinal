import { getDatabase } from '@/services/database';

/**
 * Demo switch: set to `true` in a dev build to make adding and removing fail
 * after a short delay, so the optimistic update can be seen rolling back.
 * Ignored in production builds. Keep `false` in the repo.
 */
export const SIMULATE_SAVE_ERROR = false;

const SIMULATED_DELAY_MS = 1000;

export type Favorite = {
  id: number;
  /** API slug. */
  name: string;
  /** Milliseconds since the epoch. */
  createdAt: number;
};

type FavoriteRow = {
  id: number;
  name: string;
  created_at: number;
};

async function simulateSaveError(): Promise<void> {
  if (__DEV__ && SIMULATE_SAVE_ERROR) {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
    throw new Error('Simulated save error');
  }
}

/** All favorites, newest first. */
export async function getFavorites(): Promise<Favorite[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<FavoriteRow>(
    'SELECT id, name, created_at FROM favorites ORDER BY created_at DESC',
  );
  return rows.map((row) => ({ id: row.id, name: row.name, createdAt: row.created_at }));
}

/** Saves a favorite; saving the same id again replaces it, so it is never there twice. */
export async function addFavorite(favorite: Favorite): Promise<void> {
  await simulateSaveError();
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO favorites (id, name, created_at) VALUES (?, ?, ?)',
    favorite.id,
    favorite.name,
    favorite.createdAt,
  );
}

export async function removeFavorite(id: number): Promise<void> {
  await simulateSaveError();
  const db = await getDatabase();
  await db.runAsync('DELETE FROM favorites WHERE id = ?', id);
}
