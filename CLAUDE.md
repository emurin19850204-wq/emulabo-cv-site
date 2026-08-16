# EMULABO — Claude Code Handoff

## Purpose
This repository powers the EMULABO public marketing site and administrator CMS. The objective is qualified consultation requests for fitness-business education, operations, and AI support.

## Start Here
Read `docs/handoff/CURRENT_STATE.md`, `docs/handoff/ARCHITECTURE.md`, `docs/handoff/CMS_AND_ASSETS.md`, and `todo.md`. Preserve the editorial **Operational Intelligence** visual language: off-white space, deep navy structure, restrained blue, and clear consultation CTA.

## Guardrails
- Run `pnpm test && pnpm build` after functional changes.
- Never commit credentials, OAuth cookies, API keys, database exports, or user data.
- Use tRPC procedures for data flow; do not add client-side fetch wrappers.
- Make schema changes in `drizzle/schema.ts`, generate migrations, inspect, then apply deliberately.
- Existing images are `/manus-storage/` URLs. Migrate them before external deployment.
- Verify desktop and mobile after layout work.

## Key Paths
| Purpose | Path |
|---|---|
| Public landing page | `client/src/pages/Home.tsx` |
| CMS editor | `client/src/pages/Admin.tsx` |
| Pages and links manager | `client/src/pages/SitePagesManager.tsx` |
| CMS types/defaults/parser | `shared/cms.ts` |
| API procedures | `server/routers.ts` |
| Database helpers | `server/db.ts` |
| Schema/migrations | `drizzle/schema.ts`, `drizzle/` |
| Styling | `client/src/index.css` |

## Commands
```bash
pnpm install
pnpm dev
pnpm test
pnpm build
pnpm check
```
