import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

const DATABASE_NAME = 'pokedex.db';

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`;

let opening: Promise<SQLiteDatabase> | null = null;

async function openAndMigrate(): Promise<SQLiteDatabase> {
  const db = await openDatabaseAsync(DATABASE_NAME);
  await db.execAsync(SCHEMA);
  return db;
}

/**
 * The app's one SQLite database, opened on first use with its tables created.
 * A failed open is forgotten, so the next call (e.g. "Try again") opens it again.
 */
export function getDatabase(): Promise<SQLiteDatabase> {
  if (!opening) {
    opening = openAndMigrate().catch((error: unknown) => {
      opening = null;
      throw error;
    });
  }
  return opening;
}
