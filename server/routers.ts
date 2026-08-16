import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { createSiteLink, createSitePage, deleteSiteLink, deleteSitePage, getSiteContent, getSitePageBySlug, listSiteLinks, listSitePages, saveSiteContent, updateSiteLink, updateSitePage } from "./db";
import { DEFAULT_SITE_CONTENT, parseCmsContent } from "../shared/cms";
import { z } from "zod";
import { storageCreatePresignedUpload } from "./storage";

const pagePayload = z.object({
  slug: z.string().trim().regex(/^[a-z0-9-]+$/).min(2).max(120),
  title: z.string().trim().min(1).max(220), eyebrow: z.string().max(120), summary: z.string().max(5_000), body: z.string().max(50_000), imageUrl: z.string().max(2_000), imageAlt: z.string().max(220), ctaLabel: z.string().max(120), ctaUrl: z.string().max(2_000), navLabel: z.string().max(120), headerAlign: z.enum(["left", "center", "right"]), bodyAlign: z.enum(["left", "center", "right"]), ctaAlign: z.enum(["left", "center", "right"]), showInNav: z.boolean(), isPublished: z.boolean(), sortOrder: z.number().int().min(0).max(10_000),
});
const linkPayload = z.object({ label: z.string().trim().min(1).max(120), url: z.string().trim().min(1).max(2_000), location: z.enum(["header", "footer"]), isExternal: z.boolean(), isVisible: z.boolean(), sortOrder: z.number().int().min(0).max(10_000) });

const cmsContentInput = z.object({ contentJson: z.string().min(2).max(120_000) });
const imageUploadInput = z.object({
  filename: z.string().min(1).max(160),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  siteContent: router({
    public: publicProcedure.query(async () => {
      const saved = await getSiteContent();
      return parseCmsContent(saved?.contentJson);
    }),
    adminGet: adminProcedure.query(async () => {
      const saved = await getSiteContent();
      return { content: parseCmsContent(saved?.contentJson), updatedAt: saved?.updatedAt ?? null };
    }),
    adminSave: adminProcedure.input(cmsContentInput).mutation(async ({ ctx, input }) => {
      const content = parseCmsContent(input.contentJson);
      const saved = await saveSiteContent(JSON.stringify(content), ctx.user.id);
      return { content, updatedAt: saved?.updatedAt ?? null };
    }),
    createImageUpload: adminProcedure.input(imageUploadInput).mutation(({ input }) => {
      const safeName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "-");
      return storageCreatePresignedUpload(`cms/images/${Date.now()}-${safeName}`);
    }),
  }),
  sitePages: router({
    publicNavigation: publicProcedure.query(async () => {
      const pages = await listSitePages(true);
      return pages.filter(page => page.showInNav).map(page => ({ slug: page.slug, label: page.navLabel }));
    }),
    publicBySlug: publicProcedure.input(z.object({ slug: z.string().min(2).max(120) })).query(async ({ input }) => (await getSitePageBySlug(input.slug, true)) ?? null),
    publicLinks: publicProcedure.query(() => listSiteLinks(true)),
    adminList: adminProcedure.query(() => listSitePages()),
    adminCreate: adminProcedure.input(pagePayload).mutation(({ input }) => createSitePage(input)),
    adminUpdate: adminProcedure.input(z.object({ id: z.number().int().positive(), page: pagePayload })).mutation(({ input }) => updateSitePage(input.id, input.page)),
    adminDelete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteSitePage(input.id)),
    adminLinks: adminProcedure.query(() => listSiteLinks()),
    adminCreateLink: adminProcedure.input(linkPayload).mutation(({ input }) => createSiteLink(input)),
    adminUpdateLink: adminProcedure.input(z.object({ id: z.number().int().positive(), link: linkPayload })).mutation(({ input }) => updateSiteLink(input.id, input.link)),
    adminDeleteLink: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteSiteLink(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
