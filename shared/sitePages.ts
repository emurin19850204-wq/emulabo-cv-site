export type SitePagePayload = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  body: string;
  imageUrl: string;
  imageAlt: string;
  ctaLabel: string;
  ctaUrl: string;
  navLabel: string;
  showInNav: boolean;
  isPublished: boolean;
  sortOrder: number;
};

export type SiteLinkPayload = {
  label: string;
  url: string;
  location: "header" | "footer";
  isExternal: boolean;
  isVisible: boolean;
  sortOrder: number;
};

export const EMPTY_PAGE: SitePagePayload = {
  slug: "new-page",
  title: "新しいページのタイトル",
  eyebrow: "EMULABO INSIGHT",
  summary: "このページの概要を入力します。",
  body: "本文を入力します。段落を分けるには、空行を入れてください。",
  imageUrl: "",
  imageAlt: "",
  ctaLabel: "無料オンライン相談を予約する",
  ctaUrl: "https://emulabo.com/contact",
  navLabel: "新しいページ",
  showInNav: false,
  isPublished: false,
  sortOrder: 100,
};

export const EMPTY_LINK: SiteLinkPayload = {
  label: "リンク名",
  url: "https://",
  location: "header",
  isExternal: true,
  isVisible: true,
  sortOrder: 100,
};
