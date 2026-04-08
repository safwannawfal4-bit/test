# Decisions

Purpose: record durable architectural or product decisions that affect future implementation.

Rules
- Do not store raw conversations.
- Use concise structured entries only.
- Record only decisions with ongoing impact.

Template
## [YYYY-MM-DD] Decision Title
- Context:
- Decision:
- Why:
- Impact:
- Follow-up:

Initial Entries
## [2026-04-08] Repo Uses A Closed-Loop Agent System
- Context: The repository needed a Codex operating system that improves over time rather than relying on repeated prompting.
- Decision: Use three layers: `AGENTS.md` for rules, `.agents/skills/` for execution workflows, and `docs/memory/` for structured long-term learning.
- Why: This keeps policies, task execution, and durable lessons separate and maintainable.
- Impact: Significant tasks must update memory and improve rules or skills when gaps are found.
- Follow-up: Keep memory entries compact and only store durable knowledge.
