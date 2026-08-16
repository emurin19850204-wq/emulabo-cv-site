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
