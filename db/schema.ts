import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const articles = sqliteTable('articles', {
 id: text('id').primaryKey(), slug: text('slug').notNull().unique(), title: text('title').notNull(), description: text('description').notNull().default(''), body: text('body').notNull().default(''), category: text('category').notNull(), image: text('image').notNull().default(''), imageAlt: text('image_alt').notNull().default(''), credit: text('credit').notNull().default(''), author: text('author').notNull().default('DanoNews Editorial'), status: text('status').notNull().default('draft'), publishedAt: text('published_at').notNull(), updatedAt: text('updated_at').notNull(), featured: integer('featured').notNull().default(0)
});
export const feedCache = sqliteTable('feed_cache',{key:text('key').primaryKey(), payload:text('payload').notNull(), updatedAt:integer('updated_at').notNull()});
export const admins = sqliteTable('admins',{slot:integer('slot').primaryKey(), userId:text('user_id').notNull()});
