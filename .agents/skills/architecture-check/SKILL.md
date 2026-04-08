---
name: architecture-check
description: Trigger after major changes, before marking work complete, or when a task touches architecture, auth, schema, or cross-cutting platform behavior.
---

## Workflow
1. Compare the change against `docs/architecture.md` and `docs/decisions.md`.
2. Check that the work still fits the v2 target stack: Next.js App Router, Prisma, Better Auth, Railway Postgres, and preset-driven customization.
3. Inspect server and client boundaries for leaked privileged logic, secrets, role checks, or direct data access in the client.
4. Inspect for tenant coupling, duplicated abstractions, dead code, and premature complexity.
5. Inspect for misleading product behavior such as fake checkout, fake admin actions, or UI states that imply backend guarantees that do not exist.
6. Decide whether to continue, fix immediately, or stop and flag a mismatch before more work builds on it.
7. If the issue exposed a durable lesson, route it into `task-retrospective`.

## Constraints
- Do not treat this as a generic style review.
- Do not let a technically working change pass if it drifts from the platform direction.
- Do not add new abstractions during the check unless they directly fix the issue found.

## Expected Outputs
- A concise list of architecture confirmations or risks.
- A clear continue, fix, or stop recommendation.
- Follow-up documentation needs when drift or missing guidance is found.
