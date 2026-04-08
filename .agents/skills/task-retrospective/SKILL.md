---
name: task-retrospective
description: Trigger after significant tasks, major fixes, or repeated friction.
---

## Workflow
1. Summarize what changed, what was verified, and what remains open.
2. Identify mistakes, weak assumptions, repeated friction, or avoidable detours.
3. Update the right durable doc:
   - `docs/decisions.md` for lasting product or architecture choices
   - `docs/open-questions.md` for unresolved blockers
   - `docs/status.md` for current focus, blockers, or milestone progress
   - `docs/architecture.md` if a core boundary or working pattern changed
4. If a workflow gap caused the problem, tighten `AGENTS.md` or update an existing skill.
5. Only create a new skill if the workflow is repeatable, narrow, and likely to recur.

## Constraints
- Do not dump raw conversation logs into docs.
- Do not create new skills for one-off tasks.
- Do not skip documentation when a durable lesson was learned.

## Expected Outputs
- A short retrospective summary.
- Updated project docs reflecting the durable lesson.
- A sharper rule or skill when the task exposed a repeatable gap.
