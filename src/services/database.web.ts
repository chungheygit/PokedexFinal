import type { SQLiteDatabase } from 'expo-sqlite';

/**
 * Web stand-in for `database.ts`. expo-sqlite on web needs wasm and extra
 * server headers, and favorites on web are out of scope; without this file
 * the whole web bundle fails to build. Favorites show their error state here.
 */
export function getDatabase(): Promise<SQLiteDatabase> {
  return Promise.reject(new Error('The database is not available on web.'));
}
