import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** One JSON document stores the public-site copy, repeatable content, and image URLs. */
export const siteContents = mysqlTable("site_contents", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  contentJson: text("contentJson").notNull(),
  updatedBy: int("updatedBy"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteContent = typeof siteContents.$inferSelect;

/** Editable additional pages. Only published records are visible to the public. */
export const sitePages = mysqlTable("site_pages", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 220 }).notNull(),
  eyebrow: varchar("eyebrow", { length: 120 }).notNull(),
  summary: text("summary").notNull(),
  body: text("body").notNull(),
  imageUrl: text("imageUrl").notNull(),
  imageAlt: varchar("imageAlt", { length: 220 }).notNull(),
  ctaLabel: varchar("ctaLabel", { length: 120 }).notNull(),
  ctaUrl: text("ctaUrl").notNull(),
  navLabel: varchar("navLabel", { length: 120 }).notNull(),
  headerAlign: mysqlEnum("headerAlign", ["left", "center", "right"]).default("left").notNull(),
  bodyAlign: mysqlEnum("bodyAlign", ["left", "center", "right"]).default("left").notNull(),
  ctaAlign: mysqlEnum("ctaAlign", ["left", "center", "right"]).default("left").notNull(),
  showInNav: boolean("showInNav").default(false).notNull(),
  isPublished: boolean("isPublished").default(false).notNull(),
  sortOrder: int("sortOrder").default(100).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Header and footer links can be created, ordered, and switched on by an administrator. */
export const siteLinks = mysqlTable("site_links", {
  id: int("id").autoincrement().primaryKey(),
  label: varchar("label", { length: 120 }).notNull(),
  url: text("url").notNull(),
  location: mysqlEnum("location", ["header", "footer"]).notNull(),
  isExternal: boolean("isExternal").default(false).notNull(),
  isVisible: boolean("isVisible").default(true).notNull(),
  sortOrder: int("sortOrder").default(100).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SitePage = typeof sitePages.$inferSelect;
export type SiteLink = typeof siteLinks.$inferSelect;

/** Published editorial articles managed by administrators. */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 240 }).notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  coverImageUrl: text("coverImageUrl").notNull(),
  coverImageAlt: varchar("coverImageAlt", { length: 240 }).notNull(),
  author: varchar("author", { length: 160 }).notNull(),
  isPublished: boolean("isPublished").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  sortOrder: int("sortOrder").default(100).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Videos can be external embeds or direct/storage URLs. */
export const videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 240 }).notNull(),
  description: text("description").notNull(),
  videoUrl: text("videoUrl").notNull(),
  sourceType: mysqlEnum("sourceType", ["youtube", "vimeo", "direct", "storage"]).default("youtube").notNull(),
  thumbnailUrl: text("thumbnailUrl").notNull(),
  thumbnailAlt: varchar("thumbnailAlt", { length: 240 }).notNull(),
  isPublished: boolean("isPublished").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  sortOrder: int("sortOrder").default(100).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type Video = typeof videos.$inferSelect;
