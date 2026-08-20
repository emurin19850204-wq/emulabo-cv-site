import { and, asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, blogPosts, siteContents, siteLinks, sitePages, users, videos } from "../drizzle/schema";
import type { BlogPostPayload, VideoPayload } from "../shared/blogVideo";
import type { SiteLinkPayload, SitePagePayload } from "../shared/sitePages";
import { CMS_CONTENT_SLUG } from "../shared/cms";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getSiteContent() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(siteContents).where(eq(siteContents.slug, CMS_CONTENT_SLUG)).limit(1);
  return result[0];
}

export async function saveSiteContent(contentJson: string, updatedBy: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(siteContents).values({ slug: CMS_CONTENT_SLUG, contentJson, updatedBy }).onDuplicateKeyUpdate({
    set: { contentJson, updatedBy },
  });
  return getSiteContent();
}

export async function listSitePages(publishedOnly = false) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sitePages).where(publishedOnly ? eq(sitePages.isPublished, true) : undefined).orderBy(asc(sitePages.sortOrder), asc(sitePages.id));
}

export async function getSitePageBySlug(slug: string, publishedOnly = false) {
  const db = await getDb();
  if (!db) return undefined;
  const whereClause = publishedOnly ? and(eq(sitePages.slug, slug), eq(sitePages.isPublished, true)) : eq(sitePages.slug, slug);
  const result = await db.select().from(sitePages).where(whereClause).limit(1);
  return result[0];
}

export async function createSitePage(page: SitePagePayload) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(sitePages).values(page);
  const created = await db.select().from(sitePages).where(eq(sitePages.id, Number(result[0].insertId))).limit(1);
  return created[0];
}

export async function updateSitePage(id: number, page: SitePagePayload) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(sitePages).set(page).where(eq(sitePages.id, id));
  const updated = await db.select().from(sitePages).where(eq(sitePages.id, id)).limit(1);
  return updated[0];
}

export async function deleteSitePage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(sitePages).where(eq(sitePages.id, id));
}

export async function listSiteLinks(visibleOnly = false) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteLinks).where(visibleOnly ? eq(siteLinks.isVisible, true) : undefined).orderBy(asc(siteLinks.location), asc(siteLinks.sortOrder), asc(siteLinks.id));
}

export async function createSiteLink(link: SiteLinkPayload) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(siteLinks).values(link);
  const created = await db.select().from(siteLinks).where(eq(siteLinks.id, Number(result[0].insertId))).limit(1);
  return created[0];
}

export async function updateSiteLink(id: number, link: SiteLinkPayload) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(siteLinks).set(link).where(eq(siteLinks.id, id));
  const updated = await db.select().from(siteLinks).where(eq(siteLinks.id, id)).limit(1);
  return updated[0];
}

export async function deleteSiteLink(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(siteLinks).where(eq(siteLinks.id, id));
}

export async function listBlogPosts(publishedOnly = false) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).where(publishedOnly ? eq(blogPosts.isPublished, true) : undefined).orderBy(asc(blogPosts.sortOrder), asc(blogPosts.id));
}

export async function getBlogPostBySlug(slug: string, publishedOnly = false) {
  const db = await getDb();
  if (!db) return undefined;
  const whereClause = publishedOnly ? and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true)) : eq(blogPosts.slug, slug);
  const result = await db.select().from(blogPosts).where(whereClause).limit(1);
  return result[0];
}

export async function createBlogPost(post: BlogPostPayload) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await getBlogPostBySlug(post.slug);
  if (existing) throw new Error(`ブログのスラッグ「${post.slug}」は既に使用されています。別のスラッグを指定してください。`);
  const result = await db.insert(blogPosts).values({ ...post, publishedAt: post.publishedAt ? new Date(post.publishedAt) : null });
  const created = await db.select().from(blogPosts).where(eq(blogPosts.id, Number(result[0].insertId))).limit(1);
  return created[0];
}

export async function updateBlogPost(id: number, post: BlogPostPayload) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await getBlogPostBySlug(post.slug);
  if (existing && existing.id !== id) throw new Error(`ブログのスラッグ「${post.slug}」は既に使用されています。別のスラッグを指定してください。`);
  await db.update(blogPosts).set({ ...post, publishedAt: post.publishedAt ? new Date(post.publishedAt) : null }).where(eq(blogPosts.id, id));
  const updated = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return updated[0];
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

export async function listVideos(publishedOnly = false) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(videos).where(publishedOnly ? eq(videos.isPublished, true) : undefined).orderBy(asc(videos.sortOrder), asc(videos.id));
}

export async function getVideoBySlug(slug: string, publishedOnly = false) {
  const db = await getDb();
  if (!db) return undefined;
  const whereClause = publishedOnly ? and(eq(videos.slug, slug), eq(videos.isPublished, true)) : eq(videos.slug, slug);
  const result = await db.select().from(videos).where(whereClause).limit(1);
  return result[0];
}

export async function createVideo(video: VideoPayload) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await getVideoBySlug(video.slug);
  if (existing) throw new Error(`動画のスラッグ「${video.slug}」は既に使用されています。別のスラッグを指定してください。`);
  const result = await db.insert(videos).values({ ...video, publishedAt: video.publishedAt ? new Date(video.publishedAt) : null });
  const created = await db.select().from(videos).where(eq(videos.id, Number(result[0].insertId))).limit(1);
  return created[0];
}

export async function updateVideo(id: number, video: VideoPayload) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await getVideoBySlug(video.slug);
  if (existing && existing.id !== id) throw new Error(`動画のスラッグ「${video.slug}」は既に使用されています。別のスラッグを指定してください。`);
  await db.update(videos).set({ ...video, publishedAt: video.publishedAt ? new Date(video.publishedAt) : null }).where(eq(videos.id, id));
  const updated = await db.select().from(videos).where(eq(videos.id, id)).limit(1);
  return updated[0];
}

export async function deleteVideo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(videos).where(eq(videos.id, id));
}
