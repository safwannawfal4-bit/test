# Name
retrospective

## Description
Trigger after every significant task. Use this skill to turn execution outcomes into durable learning, sharper rules, and better reusable workflows.

## Workflow
1. Summarize what was done and what changed.
2. Identify mistakes, inefficiencies, unclear requirements, and incorrect assumptions.
3. Identify friction that is likely to repeat across future tasks.
4. Decide what should improve:
   - update `AGENTS.md` if a rule was missing or too weak
   - update an existing skill if the workflow was incomplete
   - add a new pattern to `docs/memory/patterns.md` if the approach should be reused
   - add a mistake entry to `docs/memory/mistakes.md` if something failed or caused avoidable friction
   - add a decision entry to `docs/memory/decisions.md` if a durable direction was chosen
   - add an open question to `docs/memory/open-questions.md` if uncertainty remains
5. Write structured memory entries with only useful knowledge. Do not store raw conversation history.
6. Confirm whether the system actually improved; if not, state why no rule, skill, or memory change was needed.

## Constraints
- Do not skip this for significant tasks.
- Do not dump every detail into memory files.
- Do not create a new skill for one-off work.
- Do not leave repeated friction undocumented.

## Expected Outputs
- A concise retrospective summary.
- Structured updates to the relevant memory files.
- Rule, skill, or pattern improvements when the task exposed reusable lessons.
