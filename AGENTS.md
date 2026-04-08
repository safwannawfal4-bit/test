# AGENTS.md

## Mission
- Build and maintain a production-grade white-label business platform.
- Favor reusable business primitives, tenant-safe customization, and clean operator workflows over one-off client requests.
- Optimize for reusable tenant architecture, safe operator workflows, and durable product quality over short-term hacks.

## System Layers
- Rules live in `AGENTS.md`.
- Execution workflows live in `.agents/skills/`.
- Long-term learning lives in `docs/memory/`.
- If a lesson should change future behavior, convert it into a rule, a skill update, or a structured memory entry before closing the task.

## Architecture Constraints
- Primary stack: Next.js App Router, TypeScript strict mode, Prisma, server-side auth.
- Do not add Firebase or any Firebase-derived auth, storage, realtime, or analytics dependency.
- Prefer server components by default. Use client components only for interactive UI that requires browser state or DOM APIs.
- Keep business logic in server code, shared domain modules, or validated actions. Keep client code thin.
- Preserve white-label boundaries: branding, themes, labels, integrations, and tenant behavior must be configurable, not hardcoded per tenant.

## Server And Client Boundaries
- Never place privileged logic, secrets, direct database access, role checks, signing, or provider credentials in client code.
- Client code may collect input, render state, and call typed server APIs. Authorization and validation must run on the server.
- Server-only modules must stay server-only. Do not import Prisma, auth utilities, or secret-bearing code into client bundles.
- If a flow looks real to users, it must be backed by real server behavior or clearly labeled as non-production. Do not ship fake payments, fake success states, or misleading flows.

## Coding Standards
- Use strict TypeScript. Do not weaken types with `any`, broad casts, or disabled checks unless documented and justified.
- Organize work by feature slice. Keep UI, server logic, validation, and data access modular and close to the owning feature.
- Remove dead code, stale flags, unused exports, abandoned branches, and unnecessary abstractions while touching a feature.
- Prefer explicit schemas, typed contracts, and small composable modules over large mixed-responsibility files.
- Match existing conventions when they are compatible with these rules; otherwise flag the mismatch before proceeding.

## Execution Rules
- Before major work, restate the plan, the target files or areas, the main assumptions, and the expected validation steps.
- Do not start implementation until requirements, boundaries, and affected surfaces are clear.
- Make the smallest change that fully solves the task. Avoid incidental rewrites.
- When a task implies schema, auth, analytics, security, or repeated workflow risk, use the relevant skill instead of improvising.
- After major changes and before completion, run `system-check`.
- After every significant task, run `retrospective`.

## Guardrails
- If something feels wrong, stop and flag it.
- If architecture drifts from the project mission or stated stack, report it before continuing.
- If the task or requirement is unclear, restate assumptions or ask for clarification before making a risky choice.
- Never silently make risky decisions.
- Never normalize one-off tenant hacks into shared architecture without explicit review.

## Quality Gates
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- Work is not complete until the applicable gates pass for the changed app or package. If a gate cannot run, state why and what remains unverified.

## Reflection Loop
- After every significant task, analyze:
  - what went wrong
  - what was unclear
  - what assumptions were incorrect
- Then update memory:
  - `docs/memory/mistakes.md` when something failed, caused friction, or should be avoided
  - `docs/memory/patterns.md` when an approach worked well and should be reused
  - `docs/memory/decisions.md` when a durable architectural or product decision was made
  - `docs/memory/open-questions.md` when unresolved uncertainty remains
- Never store raw conversations in memory files.
- Memory entries must be structured summaries focused on:
  - what was attempted
  - what worked
  - what failed
  - why it failed
  - how to avoid it or reuse it
- Improve the system after reflection:
  - update `AGENTS.md` if a missing rule caused friction
  - update an existing skill if the workflow should change
  - create a new skill only when the task is repeatable and distinct

## Definition Of Done
- The requested behavior is implemented end-to-end.
- Authorization, validation, and data boundaries are correct.
- Lint, typecheck, tests, and build pass, or blocked gates are explicitly called out.
- Docs, configs, migrations, and examples affected by the change are updated in the same task.
- Relevant memory files are updated with durable learnings.
- The system is improved if the task exposed a missing rule, workflow, or reusable pattern.
- No dead code, debug code, fake production behavior, or temporary scaffolding remains.

## Documentation Rules
- Update docs alongside code, not afterward.
- When behavior, setup, schema, env vars, branding rules, integration steps, or operational constraints change, update the nearest relevant doc in the same change.
- Keep docs operational: include commands, locations, constraints, and decision context, not narrative filler.
- Memory docs must stay compact and useful. Store only durable knowledge with reuse value.

## Skill Map
- `feature-slice`: use for end-to-end feature work across UI, server, validation, auth, and data access.
- `preset-builder`: use when adding or changing white-label presets, theme tokens, label overrides, or tenant configuration.
- `marketing-integration`: use when adding tracking, pixels, attribution, or marketing providers.
- `prisma-migration`: use for Prisma schema edits, migrations, backfills, and data-shape changes.
- `security-review`: use when work touches auth, roles, secrets, server boundaries, validation, or external input.
- `ui-accessibility`: use when building or revising forms, interactive UI, loading and error states, or responsive layouts.
- `system-check`: use after major changes, before completion, or when uncertainty suggests hidden architecture, security, or UX issues.
- `retrospective`: use after every significant task to convert outcomes into memory, rule updates, and sharper skills.
- `release-check`: use as the final release gate after implementation, docs, system-check, and retrospective work are complete.
