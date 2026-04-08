# Patterns

Purpose: store reusable implementation and workflow patterns that have worked well in this repository.

Rules
- Do not store raw conversations.
- Store only patterns that are likely to be reused.
- Prefer concrete patterns over generic advice.

Template
## [YYYY-MM-DD] Pattern Title
- Situation:
- Pattern:
- Why it worked:
- Reuse guidance:

Initial Entries
## [2026-04-08] Rules Skills Memory Separation
- Situation: The repository needed a durable Codex workflow that could execute tasks and learn from them.
- Pattern: Separate operating rules into `AGENTS.md`, task workflows into `.agents/skills/`, and durable learning into `docs/memory/`.
- Why it worked: It prevents skills from becoming policy dumps and keeps memory useful instead of noisy.
- Reuse guidance: Use this split whenever a new repeatable workflow or learning mechanism is introduced.
