# Open Questions

Purpose: track unresolved questions that affect architecture, workflow quality, or implementation safety.

Rules
- Do not store raw conversations.
- Keep entries actionable and revisitable.
- Remove or resolve entries when the answer is known.

Template
## [YYYY-MM-DD] Question Title
- Question:
- Why it matters:
- What is blocked or uncertain:
- Next step:

Initial Entries
## [2026-04-08] Canonical App Location
- Question: Which app or package in this repository is the primary target for the white-label business platform rules and quality gates?
- Why it matters: The repo currently contains multiple project directories with different stacks and maturity levels.
- What is blocked or uncertain: Future implementation and verification could target the wrong app without an explicit canonical product boundary.
- Next step: Confirm the intended app before feature implementation begins.
