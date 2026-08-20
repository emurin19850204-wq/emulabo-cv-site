export type VideoSourceType = "youtube" | "vimeo" | "direct" | "storage";

export type BlogPostPayload = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImageUrl: string;
  coverImageAlt: string;
  author: string;
  isPublished: boolean;
  publishedAt: string | null;
  sortOrder: number;
};

export type VideoPayload = {
  slug: string;
  title: string;
  description: string;
  videoUrl: string;
  sourceType: VideoSourceType;
  thumbnailUrl: string;
  thumbnailAlt: string;
  isPublished: boolean;
  publishedAt: string | null;
  sortOrder: number;
};

export const EMPTY_BLOG_POST: BlogPostPayload = {
  slug: "new-insight",
  title: "新しい記事タイトル",
  excerpt: "記事の概要を入力します。",
  body: "本文を入力します。段落を分けるには空行を入れてください。",
  coverImageUrl: "",
  coverImageAlt: "",
  author: "EMULABO",
  isPublished: false,
  publishedAt: null,
  sortOrder: 100,
};

export const EMPTY_VIDEO: VideoPayload = {
  slug: "new-video",
  title: "新しい動画タイトル",
  description: "動画の説明を入力します。",
  videoUrl: "https://www.youtube.com/watch?v=",
  sourceType: "youtube",
  thumbnailUrl: "",
  thumbnailAlt: "",
  isPublished: false,
  publishedAt: null,
  sortOrder: 100,
};
