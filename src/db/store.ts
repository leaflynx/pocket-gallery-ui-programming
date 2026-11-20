import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { desc, eq } from 'drizzle-orm';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { Artwork } from '../api/artworks';
import { defaults, Settings } from '../ui/theme';
import { preferences, savedWorks } from './schema';

let connection: ReturnType<typeof drizzle> | undefined;
let opening: Promise<ReturnType<typeof drizzle>> | undefined;

export async function database() {
  if (connection) return connection;
  if (opening) return opening;
  opening = (async () => {
    const raw = await SQLite.openDatabaseAsync('pocket-gallery.db');
    await raw.execAsync(`CREATE TABLE IF NOT EXISTS saved_works (
    id INTEGER PRIMARY KEY, title TEXT NOT NULL, artist TEXT NOT NULL,
    date TEXT NOT NULL, technique TEXT NOT NULL, description TEXT NOT NULL,
    image_url TEXT NOT NULL, local_image TEXT, credit TEXT NOT NULL, saved_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS preferences (key TEXT PRIMARY KEY, value TEXT NOT NULL);`);
    connection = drizzle(raw);
    return connection;
  })().catch(error => { opening = undefined; throw error; });
  return opening;
}

export type Saved = Artwork & { localImage: string | null; savedAt: number };
const asSaved = (row: typeof savedWorks.$inferSelect): Saved => ({
  id: row.id, title: row.title, artist: row.artist, date: row.date,
  technique: row.technique, description: row.description, imageUrl: row.imageUrl,
  credit: row.credit, localImage: row.localImage, savedAt: row.savedAt,
});

export async function listSaved(): Promise<Saved[]> {
  const db = await database();
  return (await db.select().from(savedWorks).orderBy(desc(savedWorks.savedAt))).map(asSaved);
}

export async function addSaved(art: Artwork): Promise<Saved> {
  const db = await database();
  // Save metadata first: even when a download fails, the user keeps the title.
  await db.insert(savedWorks).values({ ...art, savedAt: Date.now(), localImage: null }).onConflictDoUpdate({
    target: savedWorks.id,
    set: { title: art.title, artist: art.artist, date: art.date, technique: art.technique,
      description: art.description, imageUrl: art.imageUrl, credit: art.credit },
  });
  let localImage: string | null = null;
  if (Platform.OS !== 'web' && art.imageUrl && FileSystem.documentDirectory) {
    try {
      const folder = FileSystem.documentDirectory + 'saved-art/';
      await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
      const result = await FileSystem.downloadAsync(art.imageUrl, `${folder}${art.id}.jpg`);
      if (result.status >= 200 && result.status < 300) {
        localImage = result.uri;
        await db.update(savedWorks).set({ localImage }).where(eq(savedWorks.id, art.id));
      }
    } catch { /* Metadata stays saved; image can still load when online. */ }
  }
  const rows = await db.select().from(savedWorks).where(eq(savedWorks.id, art.id));
  return asSaved(rows[0]);
}

export async function removeSaved(id: number) {
  const db = await database();
  const rows = await db.select().from(savedWorks).where(eq(savedWorks.id, id));
  await db.delete(savedWorks).where(eq(savedWorks.id, id));
  if (rows[0]?.localImage) {
    try { await FileSystem.deleteAsync(rows[0].localImage, { idempotent: true }); } catch { /* no file */ }
  }
}

export async function loadSettings(): Promise<Settings> {
  const db = await database();
  const rows = await db.select().from(preferences);
  const values = Object.fromEntries(rows.map(row => [row.key, row.value === 'true']));
  return { ...defaults, ...values };
}
export async function saveSettings(settings: Settings) {
  const db = await database();
  for (const [key, value] of Object.entries(settings)) {
    await db.insert(preferences).values({ key, value: String(value) }).onConflictDoUpdate({ target: preferences.key, set: { value: String(value) } });
  }
}
