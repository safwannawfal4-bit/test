# AGENTS.md

## Repository
- This repo is the planning and rebuild workspace for Alma v2: a reusable white-label business platform.
- The current `alma-tennis-academy/` app is legacy reference only. It is not the architectural source of truth.
- The live source of truth for how to build v2 is:
  - `docs/architecture.md`
  - `docs/decisions.md`
  - `docs/open-questions.md`
  - `docs/status.md`
  - `docs/legacy-reference.md`
  - `PLANS.md`

## How Codex Should Work Here
- Plan first for complex work: anything multi-step, architectural, schema-related, auth-related, or likely to span multiple files or sessions.
- Use `PLANS.md` for long-running or multi-hour tasks. Keep it updated as a living execution plan.
- Use repo-local skills from `.agents/skills/` when their trigger matches the task.
- Consult `docs/architecture.md` and `docs/decisions.md` before major changes.
- Update project docs when making durable decisions, resolving open questions, or discovering repeated mistakes.

## Rebuild Constraints
- Target architecture: Next.js App Router, Railway Postgres, Prisma, Better Auth, typed server actions and route handlers.
- Build a preset-driven white-label platform. Tenant differences belong in structured presets and configuration, not in shared feature code.
- Keep server and client boundaries strict. Do not put privileged logic, secrets, role checks, direct database access, or provider credentials in client components.
- Do not ship fake or misleading business functionality. Checkout, payments, order capture, admin actions, analytics, and status messaging must reflect real backend behavior.
- Do not copy legacy CRA/Firebase implementation patterns into v2.

## Repo Conventions
- Prefer small feature slices with clear ownership across UI, validation, auth, and data access.
- Remove dead code, placeholder flows, and incidental abstractions while touching a feature.
- Keep AGENTS concise. Put durable architecture and project knowledge in `docs/`, not here.
- If something feels architecturally wrong or unclear, stop and flag it instead of silently guessing.

## Validation
- Before calling work done, run the relevant lint, typecheck, test, and build commands for the affected app or package.
- If the v2 app has not been scaffolded yet, say what could not be verified.
- Done means: behavior works, boundaries are correct, docs are updated, and any repeated lesson has been captured in the project docs or skills.

## Skill Routing
- Core execution skills live in `.agents/skills/`.
- Reach for `feature-slice`, `preset-builder`, `prisma-migration`, `security-review`, `ui-accessibility`, `marketing-integration`, `architecture-check`, `release-check`, and `task-retrospective` when their triggers match.
