---
name: release-check
description: Trigger immediately before declaring implementation complete or ready for review.
---

## Workflow
1. Confirm the planned scope matches the actual changes and remove leftover debug or temporary code.
2. Confirm the relevant docs are updated: `docs/decisions.md`, `docs/open-questions.md`, `docs/status.md`, `docs/architecture.md`, `docs/legacy-reference.md`, or `PLANS.md` when applicable.
3. Run `architecture-check` if the change touched architecture, auth, schema, or cross-cutting behavior.
4. Run the required quality gates for the affected app or package: lint, typecheck, tests, and build.
5. Review failures and fix them before re-running the broken gate.
6. Run `task-retrospective` if the work exposed durable lessons or process gaps.
7. Summarize what passed, what changed, and any remaining blocked verification.

## Constraints
- Do not skip a gate because earlier gates passed.
- Do not mark the task done while known failures remain unexplained.
- Do not omit docs or migration artifacts that are part of the shipped change.
- Do not broaden the task during release-check; fix only completion blockers.

## Expected Outputs
- A pass or fail result for lint, typecheck, tests, and build.
- A clean completion summary with any explicit verification gaps.
- Confirmation that required docs and generated artifacts are present.
