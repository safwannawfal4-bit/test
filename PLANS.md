# PLANS.md

Use this file for long-running, multi-step work that needs a maintained execution plan.

## When To Use It
- Work spans multiple sessions or a large prompt budget.
- Work affects architecture, auth, schema, presets, or cross-cutting platform behavior.
- Work needs staged validation or explicit checkpoints before implementation continues.

## How To Maintain It
- Start with scope, assumptions, risks, and validation.
- Break the work into numbered phases with clear exit criteria.
- Update status as work progresses instead of leaving stale plans behind.
- If the plan changes materially, update this file before continuing.

## Active Program Plan
1. Rebuild foundation
   - Decide the canonical v2 app location.
   - Scaffold the Next.js App Router app with strict TypeScript and baseline quality gates.
   - Set up Railway Postgres, Prisma, Better Auth, env handling, and local development docs.
2. White-label platform core
   - Define tenant presets, theme tokens, label overrides, and structured customization boundaries.
   - Establish shared business entities: tenants, staff, customers, catalog, orders, and marketing settings.
3. Business workflows
   - Implement catalog browsing, cart and order capture, admin operations, and customer flows with real server boundaries.
   - Add marketing and tracking integrations through typed provider abstractions.
4. Hardening
   - Tighten auth, role enforcement, auditability, UX states, and release validation.
   - Retire legacy reference gaps by documenting what migrated conceptually and what stays prototype-only.

## Plan Template
### Task
- Objective:
- Scope:
- Assumptions:
- Risks:
- Validation:

### Steps
1. Pending
2. Pending
3. Pending

### Notes
- Decisions:
- Blockers:
- Follow-up:
