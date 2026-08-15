import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { DEFAULT_SITE_CONTENT, parseCmsContent } from "../shared/cms";
import type { TrpcContext } from "./_core/context";

describe("CMS content parsing", () => {
  it("uses the complete site default when no CMS document exists", () => {
    expect(parseCmsContent(null)).toEqual(DEFAULT_SITE_CONTENT);
  });

  it("preserves required defaults when an editor saves a partial document", () => {
    const result = parseCmsContent(JSON.stringify({
      hero: { title: "更新したタイトル" },
      contactUrl: "https://example.com/reserve",
    }));

    expect(result.hero.title).toBe("更新したタイトル");
    expect(result.hero.note).toBe(DEFAULT_SITE_CONTENT.hero.note);
    expect(result.contactUrl).toBe("https://example.com/reserve");
    expect(result.faqs).toHaveLength(DEFAULT_SITE_CONTENT.faqs.length);
  });

  it("safely ignores malformed persisted JSON", () => {
    expect(parseCmsContent("not-json")).toEqual(DEFAULT_SITE_CONTENT);
  });

  it("rejects CMS reads by a signed-in non-admin user before data access", async () => {
    const context = {
      user: {
        id: 99,
        openId: "regular-user",
        name: "Regular User",
        email: "regular@example.com",
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: { protocol: "https", headers: {} },
      res: {},
    } as unknown as TrpcContext;

    const caller = appRouter.createCaller(context);
    await expect(caller.siteContent.adminGet()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
