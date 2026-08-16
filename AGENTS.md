# EMULABO — Agent Instructions

All coding agents, including Codex, must follow `CLAUDE.md` and `docs/handoff/`.

Inspect the relevant page, shared type, tRPC router, database helper, and test before modifying functionality. Preserve the React 19 + Vite + Tailwind CSS 4 + tRPC + Drizzle architecture, admin-only CMS mutations, and CMS fallback parsing.

For every functional change, run:

```bash
pnpm test && pnpm build
```

Do not add secrets, production database exports, session cookies, or OAuth tokens. Use `docs/handoff/EXTERNAL_MIGRATION.md` for non-Manus deployment planning.
