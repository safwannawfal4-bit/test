# Decisions

## 2026-04-08: Repo Guidance Is Split By Responsibility
- Decision: Keep `AGENTS.md` as the main routing file, `.agents/skills/` for reusable workflows, `docs/` for long-term project knowledge, and `PLANS.md` for active long-running execution plans.
- Why: This keeps always-on guidance concise and prevents the repo setup from turning into a single bloated file.

## 2026-04-08: Legacy Alma Is Reference Only
- Decision: Treat `alma-tennis-academy/` as a reference artifact for concepts and migration inventory, not as implementation guidance.
- Why: The legacy app is a CRA/Firebase prototype with weak server boundaries, client-side admin logic, exposed Firebase config in frontend code, and unfinished or misleading business flows.

## 2026-04-08: V2 Architecture Target
- Decision: Build Alma v2 around Next.js App Router, Railway Postgres, Prisma, Better Auth, typed server boundaries, and a preset-driven white-label model.
- Why: This aligns the rebuild with a maintainable business platform architecture instead of extending prototype patterns.

## 2026-04-08: Keep Codex Setup Lightweight
- Decision: Use focused repo skills and concise docs. Add rules or skills only when they solve repeated friction.
- Why: Short, accurate guidance is easier for Codex to load and follow than broad but vague scaffolding.
