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

  it("adds safe left alignment defaults to CMS documents saved before the alignment feature", () => {
    const result = parseCmsContent(JSON.stringify({
      hero: { title: "既存のヒーロー" },
      finalCta: { title: "既存のCTA" },
    }));

    expect(result.hero.align).toBe("left");
    expect(result.finalCta.align).toBe("left");
  });

  it("adds the audience and resource defaults to CMS documents saved before the integrated-site feature", () => {
    const result = parseCmsContent(JSON.stringify({
      audiences: { corporate: { title: "法人向けの更新見出し" } },
      resources: { personal: { url: "https://example.com/first-session" } },
    }));

    expect(result.audiences.corporate.title).toBe("法人向けの更新見出し");
    expect(result.audiences.corporate.href).toBe(DEFAULT_SITE_CONTENT.audiences.corporate.href);
    expect(result.audiences.personal.title).toBe(DEFAULT_SITE_CONTENT.audiences.personal.title);
    expect(result.resources.corporate.url).toBe(DEFAULT_SITE_CONTENT.resources.corporate.url);
    expect(result.resources.personal.url).toBe("https://example.com/first-session");
    expect(result.resources.personal.label).toBe(DEFAULT_SITE_CONTENT.resources.personal.label);
  });

  it("adds image alternative-text defaults to CMS documents saved before image manager improvements", () => {
    const result = parseCmsContent(JSON.stringify({
      assets: { profileImageUrl: "https://example.com/profile.jpg", workshopImageAlt: "研修の様子" },
    }));

    expect(result.assets.profileImageUrl).toBe("https://example.com/profile.jpg");
    expect(result.assets.profileImageAlt).toBe(DEFAULT_SITE_CONTENT.assets.profileImageAlt);
    expect(result.assets.workshopImageAlt).toBe("研修の様子");
    expect(result.assets.operationsImageAlt).toBe(DEFAULT_SITE_CONTENT.assets.operationsImageAlt);
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
