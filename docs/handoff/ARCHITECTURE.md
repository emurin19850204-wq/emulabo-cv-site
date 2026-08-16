# Architecture

| Layer | Technology | Responsibility |
|---|---|---|
| Client | React 19, Vite, Tailwind CSS 4 | Public site and CMS interface |
| API | Express + tRPC 11 | Typed public/admin procedures |
| Data | Drizzle + MySQL/TiDB | Content, pages, links, users |
| Auth | Manus OAuth currently | Admin role/session |
| Images | Manus storage URLs currently | Site images |

## Request Flow

```text
Public visitor → Home.tsx → siteContent.public → site_contents.contentJson
Admin → Admin.tsx → siteContent.adminGet/adminSave → adminProcedure → site_contents.contentJson
Admin → SitePagesManager.tsx → sitePages.* → site_pages / site_links
```

`shared/cms.ts` defines `CmsContent`, default values, and `parseCmsContent`. The parser merges stored JSON over defaults for backward compatibility.

| Router | Access | Role |
|---|---|---|
| `siteContent.public` | Public | Loads parsed CMS content |
| `siteContent.adminGet` | Admin | Loads content/update timestamp |
| `siteContent.adminSave` | Admin | Validates and persists CMS JSON |
| `siteContent.createImageUpload` | Admin | Creates Manus upload target |
| `sitePages.public*` | Public | Published pages/navigation |
| `sitePages.admin*` | Admin | Pages and links CRUD |

| Table | Use |
|---|---|
| `users` | Identity and `admin`/`user` role |
| `site_contents` | Homepage content JSON, slug `home` |
| `site_pages` | Additional public pages |
| `site_links` | Header/footer links |
