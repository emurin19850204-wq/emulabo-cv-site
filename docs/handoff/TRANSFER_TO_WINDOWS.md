# Windows Transfer Instructions

1. Download `emulabo-cv-site-handoff.zip` from this conversation.
2. Open `C:\Users\emuri\OneDrive\デスクトップ\emura-workspace` in File Explorer.
3. Extract the ZIP there. The intended result is `C:\Users\emuri\OneDrive\デスクトップ\emura-workspace\emulabo-cv-site`.
4. Open the folder with VS Code, Claude Code, or Codex.
5. Read `CLAUDE.md` or `AGENTS.md`, then run `pnpm install`.
6. Configure database/auth/storage secrets only through your chosen deployment environment; never commit them.

The ZIP excludes `node_modules`, `dist`, `.git`, runtime logs, local environment files, and Manus-only operational metadata.
