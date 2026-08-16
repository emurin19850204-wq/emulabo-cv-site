# External Migration Checklist

| Current dependency | External replacement |
|---|---|
| Manus OAuth | Auth provider or custom admin authentication |
| Manus-managed TiDB/MySQL | MySQL-compatible database |
| Manus storage URLs | S3/R2/CDN bucket with copied files |
| Manus environment injection | Deployment secrets manager |
| Manus runtime | Node hosting compatible with Express/Vite build |

1. Create a private Git repository and run `pnpm install`.
2. Provision a MySQL database and set credentials only in the host's secure secrets manager.
3. Apply Drizzle migrations and import an authorized CMS JSON export.
4. Copy `/manus-storage/` assets to object storage and update CMS URLs.
5. Replace Manus OAuth and storage upload procedure.
6. Run `pnpm test && pnpm build`; verify `/`, `/admin`, extra pages, links, and consultation CTA.

> Do not assume `/manus-storage/` URLs will remain usable outside Manus.
