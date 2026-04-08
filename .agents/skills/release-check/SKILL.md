# Name
release-check

## Description
Trigger immediately before declaring implementation complete or ready for review. Use this as the final gate after code and docs are updated.

## Workflow
1. Confirm the planned scope matches the actual changes and remove leftover debug or temporary code.
2. Run the required quality gates for the affected app or package: lint, typecheck, tests, and build.
3. Review failures and fix them before re-running the broken gate.
4. Confirm docs, env examples, migrations, and generated artifacts are committed when applicable.
5. Summarize what passed, what was changed, and any remaining blocked verification.

## Constraints
- Do not skip a gate because earlier gates passed.
- Do not mark the task done while known failures remain unexplained.
- Do not omit docs or migration artifacts that are part of the shipped change.
- Do not broaden the task during release-check; fix only completion blockers.

## Expected Outputs
- A pass or fail result for lint, typecheck, tests, and build.
- A clean completion summary with any explicit verification gaps.
- Confirmation that required docs and generated artifacts are present.
