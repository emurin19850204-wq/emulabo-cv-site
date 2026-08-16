# Current State — 2026-08-16

## Delivered Product

EMULABO is a responsive B2B consultation-acquisition site with a Manus OAuth-protected administrator CMS. Text, image URLs, line breaks, alignment, additional pages, and header/footer links are editable.

| Area | Status | Notes |
|---|---:|---|
| Public landing page | Complete | Consultation-focused and responsive |
| CMS text and image URLs | Complete | `/admin`, admin-only mutations |
| Line breaks and alignment | Complete | Newlines and left/center/right controls |
| Extra pages and links | Complete | CMS-managed pages and navigation |
| Solution loop | Complete | 6-step SVG diagram fixed and verified |
| Visual proof | Complete | Consultation, workshop, operations cards |
| CMS browser verification | Complete | Hero newline and centered alignment saved publicly |
| Tests/build | Complete | 6 tests passed; production build passed |

## Latest Confirmed Content State

The hero title contains a newline after `育成の「属人化」を、` and its active CMS alignment is **center**. The three visual-proof image fields are populated. The source of truth is the `site_contents` database record; it is not bundled as a portable database export.

## Latest Manus Checkpoint

`defbbe0a` — CMS save verification, central hero alignment, visual proof images, responsive verification, and build/test confirmation.

## External Migration Work

A non-Manus deployment must provision a MySQL-compatible database, authentication replacement, object storage, and a migration of `/manus-storage/` images. See `EXTERNAL_MIGRATION.md`.
