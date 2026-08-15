import { describe, expect, it } from "vitest";
import { DEFAULT_SITE_CONTENT, parseCmsContent } from "./cms";

describe("parseCmsContent", () => {
  it("returns the safe default document when content has not been saved", () => {
    expect(parseCmsContent(null)).toEqual(DEFAULT_SITE_CONTENT);
  });

  it("merges a saved partial document with required defaults", () => {
    const result = parseCmsContent(JSON.stringify({ hero: { title: "更新したタイトル" }, contactUrl: "https://example.com/reserve" }));
    expect(result.hero.title).toBe("更新したタイトル");
    expect(result.hero.note).toBe(DEFAULT_SITE_CONTENT.hero.note);
    expect(result.contactUrl).toBe("https://example.com/reserve");
    expect(result.faqs).toHaveLength(DEFAULT_SITE_CONTENT.faqs.length);
  });

  it("falls back to defaults when persisted JSON is malformed", () => {
    expect(parseCmsContent("not-json")).toEqual(DEFAULT_SITE_CONTENT);
  });
});
