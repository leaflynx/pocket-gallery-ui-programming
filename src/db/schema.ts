import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const savedWorks = sqliteTable('saved_works', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  date: text('date').notNull(),
  technique: text('technique').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(),
  localImage: text('local_image'),
  credit: text('credit').notNull(),
  savedAt: integer('saved_at').notNull(),
});

export const preferences = sqliteTable('preferences', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
