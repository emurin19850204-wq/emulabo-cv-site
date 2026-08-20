import { describe, expect, it } from "vitest";
import { EMPTY_BLOG_POST, EMPTY_VIDEO } from "../shared/blogVideo";

describe("blog and video CMS defaults", () => {
  it("starts blog posts as unpublished with editable long-form fields", () => {
    expect(EMPTY_BLOG_POST.isPublished).toBe(false);
    expect(EMPTY_BLOG_POST.slug).toMatch(/^[a-z0-9-]+$/);
    expect(EMPTY_BLOG_POST.body.length).toBeGreaterThan(0);
    expect(EMPTY_BLOG_POST.publishedAt).toBeNull();
  });

  it("starts videos as unpublished and explicitly identifies the source type", () => {
    expect(EMPTY_VIDEO.isPublished).toBe(false);
    expect(EMPTY_VIDEO.sourceType).toBe("youtube");
    expect(EMPTY_VIDEO.videoUrl.startsWith("https://")).toBe(true);
    expect(EMPTY_VIDEO.publishedAt).toBeNull();
  });
});
